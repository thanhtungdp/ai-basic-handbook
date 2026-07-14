'use client';

import { useEffect, useId, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

interface VideoTrackerProps {
  videoId: string;
  slug: string;
  title?: string;
}

const TICK_INTERVAL_MS = 30_000;

// ---- Minimal YouTube IFrame API typings (we don't ship @types/youtube) ----
interface YTPlayer {
  getCurrentTime: () => number;
  destroy: () => void;
}
interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}
type YTStateChangeHandler = (event: YTPlayerEvent) => void;
type YTReadyHandler = (event: { target: YTPlayer }) => void;
interface YTPlayerOptions {
  videoId: string;
  playerVars?: Record<string, unknown>;
  events?: {
    onReady?: YTReadyHandler;
    onStateChange?: YTStateChangeHandler;
  };
}
interface YTNamespace {
  Player: new (
    elementId: string | HTMLElement,
    options: YTPlayerOptions,
  ) => YTPlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
    BUFFERING: number;
    CUED: number;
  };
}
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// ---- Script loader promise (shared across all VideoTracker instances) ----
let apiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeAPI(): Promise<YTNamespace> {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve) => {
    if (typeof window === 'undefined') return;

    // If the API was already loaded by a previous instance / another component.
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }

    // Preserve any existing callback and chain ours after it.
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };

    // Inject the script tag once.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existing) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      document.head.appendChild(tag);
    }
  });

  return apiPromise;
}

/**
 * Replaces raw `<div className="video-container"><iframe/></div>` blocks.
 * Loads the YouTube IFrame API, creates a managed player, and reports
 * watch-time deltas to the backend while the user is signed in.
 */
export function VideoTracker({ videoId, slug, title }: VideoTrackerProps) {
  const { isSignedIn } = useUser();

  const reactId = useId();
  const containerIdRef = useRef<string>(
    `yt-player-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`,
  );
  const playerRef = useRef<YTPlayer | null>(null);
  const isPlayingRef = useRef(false);
  const lastTickRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stable refs for unload handlers.
  const slugRef = useRef(slug);
  slugRef.current = slug;
  const isSignedInRef = useRef(isSignedIn);
  isSignedInRef.current = isSignedIn;

  const sendVideoProgress = (
    deltaSeconds: number,
    positionSeconds: number,
    watched: boolean,
    keepalive = false,
  ) => {
    if (deltaSeconds < 0) deltaSeconds = 0;
    const body = JSON.stringify({
      slug: slugRef.current,
      videoWatchTimeDelta: deltaSeconds,
      videoPositionSeconds: positionSeconds,
      videoWatched: watched,
    });
    void fetch('/api/progress/video', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive,
    }).catch(() => {
      /* best-effort */
    });
  };

  const flushDelta = (keepalive = false) => {
    const player = playerRef.current;
    if (!player) return;
    const now = Date.now();
    const elapsedMs = now - lastTickRef.current;
    const deltaSeconds = Math.round(elapsedMs / 1000);
    lastTickRef.current = now;
    if (isPlayingRef.current && deltaSeconds > 0) {
      sendVideoProgress(
        deltaSeconds,
        Math.floor(player.getCurrentTime()),
        true,
        keepalive,
      );
    }
  };

  useEffect(() => {
    const elementId = containerIdRef.current;
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled) return;

      playerRef.current = new YT.Player(elementId, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            lastTickRef.current = Date.now();
          },
          onStateChange: (event) => {
            const state = event.data;
            const playing = state === YT.PlayerState.PLAYING;

            if (isPlayingRef.current && !playing) {
              // Paused / ended / buffered → flush accumulated delta immediately.
              flushDelta();
            }
            isPlayingRef.current = playing;
            if (playing) {
              lastTickRef.current = Date.now();
            }
          },
        },
      });

      // Periodic flush while playing — only when signed in.
      intervalRef.current = setInterval(() => {
        if (!isSignedInRef.current) return;
        if (isPlayingRef.current) {
          flushDelta();
        }
      }, TICK_INTERVAL_MS);
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isSignedInRef.current) {
        flushDelta(true);
      }
    };
    const handlePageHide = () => {
      if (isSignedInRef.current) flushDelta(true);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (isSignedInRef.current) flushDelta(true);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        maxWidth: '100%',
        marginBottom: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--border)',
      }}
    >
      {/* The YT API replaces this div with the iframe. */}
      <div
        id={containerIdRef.current}
        title={title}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}