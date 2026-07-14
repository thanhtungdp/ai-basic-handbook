'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function PostHogAnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageview: false, // we track pageviews manually
      capture_pageleave: true,
    });
  }, []);

  return (
    <InnerProvider>{children}</InnerProvider>
  );
}

/**
 * Inner provider that has access to Clerk's useUser hook.
 * Identifies the user in PostHog whenever they sign in.
 */
function InnerProvider({ children }: { children: React.ReactNode }) {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const email = user.primaryEmailAddress?.emailAddress;
      const fullName = user.fullName || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

      posthog.identify(user.id, {
        email: email,
        name: fullName,
      });
    } else {
      posthog.reset();
    }
  }, [isSignedIn, user]);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
