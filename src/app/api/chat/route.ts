import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  type UIMessage,
} from 'ai';
import { z } from 'zod';
import { source } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';
import type { ChatUIMessage, SearchTool } from '../../../components/ai/search';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!('getText' in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: await page.data.getText('processed'),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const systemPrompt = [
  'You are an AI assistant for a documentation site.',
  'Answer in Vietnamese by default.',
  'Use the provided documentation context to answer accurately.',
  'Cite sources as markdown links using the document url when available.',
  'If you cannot find the answer in the provided context, say you do not know and suggest a better search query.',
].join('\n');

async function searchDocs(query: string, limit = 6) {
  const search = await searchServer;
  return await search.searchAsync(query, { limit, merge: true, enrich: true });
}

function extractLastUserText(messages: unknown[]): string {
  const reversed = [...messages].reverse();
  for (const msg of reversed) {
    if (typeof msg !== 'object' || msg === null) continue;
    const role = (msg as { role?: string }).role;
    if (role !== 'user') continue;
    const parts = (msg as { parts?: Array<{ type?: string; text?: string }> }).parts ?? [];
    const text = parts
      .filter((p) => p?.type === 'text' && typeof p.text === 'string')
      .map((p) => p.text)
      .join('\n');
    if (text.trim()) return text.trim();
  }
  return '';
}

function extractSseDataLines(chunk: string): string[] {
  const lines = chunk.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      out.push(line.slice(6));
    }
  }
  return out;
}

async function streamOpenAICompat(
  messages: Array<{ role: string; content: string }>,
  onDelta: (delta: string) => void,
) {
  const apiKey = process.env.OPENAI_COMPAT_API_KEY || process.env.LLM_GATEWAY_API_KEY;
  const baseURL = process.env.OPENAI_COMPAT_BASE_URL || 'https://llmgate.app/v1';
  const model = process.env.OPENAI_COMPAT_MODEL || process.env.LLM_GATEWAY_MODEL || 'gpt-5.4-mini';

  if (!apiKey) {
    throw new Error('OPENAI_COMPAT_API_KEY is missing');
  }

  const response = await fetch(`${baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: ['Be', 'arer '].join('') + apiKey,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      stream: true,
      messages,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI-compatible provider error ${response.status}: ${body.slice(0, 500)}`);
  }

  if (!response.body) {
    throw new Error('Provider returned no response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const dataLines = extractSseDataLines(part);
      for (const dataLine of dataLines) {
        if (dataLine === '[DONE]') return;

        let json: any;
        try {
          json = JSON.parse(dataLine);
        } catch {
          continue;
        }

        const delta = json?.choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta.length > 0) {
          onDelta(delta);
        }
      }
    }
  }
}

export async function POST(req: Request) {
  const reqJson = await req.json();
  const incomingMessages = (reqJson.messages ?? []) as ChatUIMessage[];
  const userQuery = extractLastUserText(incomingMessages);

  const searchResults = userQuery ? await searchDocs(userQuery, 6) : [];
  const contextText = JSON.stringify(searchResults, null, 2);

  const modelMessages = await convertToModelMessages<ChatUIMessage>(incomingMessages, {
    convertDataPart(part) {
      if (part.type === 'data-client') {
        return {
          type: 'text',
          text: `[Client Context: ${JSON.stringify(part.data)}]`,
        };
      }
    },
  });

  const flatMessages = modelMessages
    .map((m) => {
      const content = Array.isArray(m.content)
        ? m.content
            .map((part) => ('text' in part && typeof part.text === 'string' ? part.text : ''))
            .join('\n')
        : typeof m.content === 'string'
          ? m.content
          : '';
      return { role: m.role, content };
    })
    .filter((m) => m.content.trim().length > 0);

  const finalMessages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'system',
      content:
        `Documentation search results (JSON):\n${contextText}\n\n` +
        'Use these results as your source of truth when answering. Cite relevant `url` values as markdown links.',
    },
    ...flatMessages,
  ];

  const stream = createUIMessageStream<UIMessage>({
    execute: async ({ writer }) => {
      const id = 'answer';
      writer.write({ type: 'text-start', id });

      try {
        await streamOpenAICompat(finalMessages, (delta) => {
          writer.write({ type: 'text-delta', id, delta });
        });
      } catch (error) {
        writer.write({
          type: 'text-delta',
          id,
          delta:
            error instanceof Error
              ? `Ask AI đang lỗi cấu hình/provider: ${error.message}`
              : 'Ask AI đang lỗi cấu hình/provider.',
        });
      }

      writer.write({ type: 'text-end', id });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

const searchTool = tool({
  description: 'Search the docs content and return raw JSON results.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, { limit, merge: true, enrich: true });
  },
}) satisfies SearchTool;
