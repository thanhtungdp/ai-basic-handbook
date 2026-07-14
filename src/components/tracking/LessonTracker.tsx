'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

interface LessonTrackerProps {
  slug: string;
  isLocked: boolean;
  children: React.ReactNode;
}

const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Wraps lesson content and sends periodic "heartbeat" pings to the server
 * so the backend can estimate how long the user has the lesson open.
 *
 * Only active when the user is signed in and the lesson is not locked.
 */
export function LessonTracker({ slug, isLocked, children }: LessonTrackerProps) {
  const { isSignedIn } = useUser();

  const sessionIdRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Keep slug in a ref so the unload handlers always read the latest value.
  const slugRef = useRef(slug);
  slugRef.current = slug;

  const sendHeartbeat = (keepalive = false) => {
    const id = sessionIdRef.current;
    if (!id) return;
    const body = JSON.stringify({ slug: slugRef.current, sessionId: id });
    void fetch('/api/progress/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive,
    }).catch(() => {
      /* swallow — best-effort telemetry */
    });
  };

  useEffect(() => {
    // Only run when signed in AND lesson is unlocked.
    if (!isSignedIn || isLocked) return;

    sessionIdRef.current = crypto.randomUUID();

    // Send an initial heartbeat so the session is registered immediately.
    sendHeartbeat();

    intervalRef.current = setInterval(() => {
      sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendHeartbeat(true);
      }
    };
    const handlePageHide = () => {
      sendHeartbeat(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      // Best-effort final heartbeat on unmount.
      sendHeartbeat(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLocked, slug]);

  return <>{children}</>;
}