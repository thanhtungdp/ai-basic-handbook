import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import '@/components/handbook/handbook-global.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PostHogAnalyticsProvider } from '@/components/analytics/posthog-provider';
import PostHogPageView from '@/components/analytics/posthog-pageview';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kada-program.vercel.app'),
  title: {
    default: 'KADA Program — AI Training thực chiến',
    template: '%s — KADA Program',
  },
  description:
    'KADA Training Program — 8 ngày × 6 giờ. Hands-on Claude, prompting có kiểm chứng, structured content, workflow automation đến capstone sản phẩm end-to-end.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <PostHogAnalyticsProvider>
          <RootProvider>{children}</RootProvider>
          <PostHogPageView />
        </PostHogAnalyticsProvider>
      </body>
    </html>
  );
}