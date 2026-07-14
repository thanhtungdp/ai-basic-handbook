'use client';

import { useEffect, useState } from 'react';
import { LockIcon } from 'lucide-react';

interface CourseLockProps {
  title: string;
  description?: string;
  teaser?: string;
  unlockDate: string;
  weekLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function calculateTimeLeft(target: Date) {
  const diff = target.getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

export function CourseLock({
  title,
  description,
  unlockDate,
  weekLabel,
  imageSrc,
  imageAlt,
}: CourseLockProps) {
  const target = new Date(unlockDate);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(target));

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex flex-col items-center py-4 px-4">
      <div className="w-full max-w-xl">
        {/* Cover image — direct render, 100% width, no wrapper */}
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="w-full rounded-xl border border-foreground/10 shadow-sm mb-4"
            style={{ aspectRatio: '1200 / 630', objectFit: 'cover' }}
          />
        )}

        {/* Lock badge + week label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium border border-orange-500/20">
            <LockIcon className="w-3 h-3" />
            Nội dung chưa mở
          </span>
          {weekLabel && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {weekLabel}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-center mb-1">{title}</h2>
        {description && (
          <p className="text-center text-sm text-muted-foreground mb-3">{description}</p>
        )}

        {/* Countdown — compact */}
        <div className="bg-card rounded-lg p-3 border border-border flex flex-col items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            Mở vào {formatDate(unlockDate)}
          </span>
          <div className="flex items-center gap-2.5">
            <TimeUnit value={mounted ? timeLeft.days : 0} label="ngày" />
            <Sep />
            <TimeUnit value={mounted ? timeLeft.hours : 0} label="giờ" />
            <Sep />
            <TimeUnit value={mounted ? timeLeft.minutes : 0} label="phút" />
            <Sep />
            <TimeUnit value={mounted ? timeLeft.seconds : 0} label="giây" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-xl font-bold tabular-nums text-foreground">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function Sep() {
  return <span className="text-base text-muted-foreground/30">:</span>;
}