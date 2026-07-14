import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import '@/components/handbook/handbook-global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { viVN } from '@clerk/localizations';
import { PostHogAnalyticsProvider } from '@/components/analytics/posthog-provider';
import PostHogPageView from '@/components/analytics/posthog-pageview';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hermes-handbook.nousresearch.com'),
  title: {
    default: 'Hermes Handbook — Xây đội AI tự chủ cho Solo CEO',
    template: '%s — Hermes Handbook',
  },
  description:
    'Handbook thực chiến giúp Solo CEO xây đội AI tự chủ: ra lệnh qua Telegram, biến việc lặp thành agent tự chạy, và trong 4 tuần có 1–2 agent làm việc thật mỗi ngày.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <ClerkProvider localization={viVN}>
          <PostHogAnalyticsProvider>
            <RootProvider>{children}</RootProvider>
            <PostHogPageView />
          </PostHogAnalyticsProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
