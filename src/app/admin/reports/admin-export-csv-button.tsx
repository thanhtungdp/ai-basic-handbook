'use client';

import { Download } from 'lucide-react';

interface AdminExportCsvButtonProps {
  rows: Array<{
    email: string;
    fullName: string;
    lessonsDone: number;
    totalLessons: number;
    progressPercent: number;
    totalTimeSeconds: number;
    videoWatchTimeSeconds: number;
    lastActiveAt: string;
  }>;
}

export function AdminExportCsvButton({ rows }: AdminExportCsvButtonProps) {
  const handleClick = () => {
    const headers = [
      'Email',
      'Họ tên',
      'Bài đã xong',
      'Tổng bài',
      'Tiến độ %',
      'Thời gian học (s)',
      'Thời gian video (s)',
      'Hoạt động cuối',
    ];

    const csvRows = rows.map((s) => [
      s.email,
      s.fullName,
      s.lessonsDone,
      s.totalLessons,
      s.progressPercent,
      s.totalTimeSeconds,
      s.videoWatchTimeSeconds,
      s.lastActiveAt,
    ]);

    const csv = [headers, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
    >
      <Download className="size-4" />
      Export CSV
    </button>
  );
}
