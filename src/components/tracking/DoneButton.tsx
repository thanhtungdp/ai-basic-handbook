'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Check } from 'lucide-react';

interface DoneButtonProps {
  slug: string;
}

type LoadState = 'loading' | 'done' | 'not-done';

/**
 * Lesson completion CTA.
 * - Sticky/fixed while reading
 * - Docks back into the lesson footer when user reaches the end of the article
 */
export function DoneButton({ slug }: DoneButtonProps) {
  const { isSignedIn } = useUser();

  const [status, setStatus] = useState<LoadState>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [dockToBottom, setDockToBottom] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    let cancelled = false;
    setStatus('loading');

    fetch(`/api/progress/${encodeURIComponent(slug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && data.status === 'done') setStatus('done');
        else setStatus('not-done');
      })
      .catch(() => {
        if (!cancelled) setStatus('not-done');
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, slug]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setDockToBottom(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.01,
      },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/progress/done', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) setStatus('done');
    } finally {
      setSubmitting(false);
    }
  }, [slug]);

  if (!isSignedIn) return null;

  const disabled = status === 'loading' || submitting || status === 'done';
  const done = status === 'done';
  const label = done ? 'Đã học xong ✓' : submitting ? 'Đang lưu…' : 'Đánh dấu đã học xong';
  const isFloating = !dockToBottom;

  return (
    <div className="mt-8">
      <div className={isFloating ? 'h-28 lg:h-32' : 'h-4'} aria-hidden="true" />

      <div
        className={[
          isFloating
            ? 'fixed inset-x-4 bottom-4 z-40 mx-auto w-[min(calc(100vw-2rem),720px)]'
            : 'relative mx-auto w-full max-w-[860px]',
        ].join(' ')}
        style={
          isFloating
            ? { bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }
            : undefined
        }
      >
        <div
          className={[
            'pointer-events-none absolute inset-x-10 -bottom-3 h-10 rounded-full blur-2xl',
            isFloating
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(196,97,47,0.28),rgba(196,97,47,0))]'
              : 'bg-[radial-gradient(ellipse_at_center,rgba(196,97,47,0.18),rgba(196,97,47,0))]',
          ].join(' ')}
        />

        <button
          type="button"
          onClick={done ? undefined : handleClick}
          disabled={disabled}
          className={[
            'relative w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition-all duration-200',
            isFloating
              ? 'shadow-[0_14px_40px_rgba(0,0,0,0.18)] backdrop-blur-sm'
              : 'shadow-[0_10px_24px_rgba(0,0,0,0.10)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-fd-ring)]/60',
            done
              ? 'cursor-default border-green-500/40 bg-green-500/12 text-green-700 dark:text-green-400'
              : 'cursor-pointer border-[color:var(--color-fd-primary)]/35 bg-fd-background/95 text-fd-foreground hover:-translate-y-0.5 hover:border-[color:var(--color-fd-primary)]/65 hover:shadow-[0_18px_46px_rgba(196,97,47,0.18)] active:translate-y-0',
            disabled && !done ? 'cursor-wait opacity-80' : '',
          ].join(' ')}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {disabled && !done ? (
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Check className="size-4" />
            )}
            {label}
          </span>
        </button>
      </div>

      <div ref={sentinelRef} className="h-px w-full" aria-hidden="true" />
    </div>
  );
}
