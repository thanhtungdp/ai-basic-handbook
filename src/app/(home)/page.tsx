import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16 max-w-3xl mx-auto">
      <span className="text-sm font-medium text-orange-500 mb-3">
        Hermes Handbook
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
        Xây đội AI tự chủ cho Solo CEO
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        Ra lệnh qua Telegram. Biến việc lặp thành agent tự chạy.
        Trong 4 tuần, có 1–2 agent làm việc thật mỗi ngày.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          href="/docs/khoa-hoc-hermes-handbook"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          Bắt đầu khóa học →
        </Link>
        <Link
          href="/docs/use-case-library"
          className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Xem use case
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">7</div>
          <div className="text-sm font-medium mb-1">Bài học</div>
          <div className="text-xs text-muted-foreground">
            Từ tư duy Hermes đến đội agent
          </div>
        </div>
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">20</div>
          <div className="text-sm font-medium mb-1">Challenge</div>
          <div className="text-xs text-muted-foreground">
            4 tuần, mỗi ngày 60–90 phút
          </div>
        </div>
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">6</div>
          <div className="text-sm font-medium mb-1">Use case</div>
          <div className="text-xs text-muted-foreground">
            Sát tiền: sales, marketing, ops, finance
          </div>
        </div>
      </div>
      <div className="mt-10 text-sm text-muted-foreground max-w-lg">
        Không học thêm công cụ AI. Xây một hệ thống vận hành —
        với agent, skill, cron, và Telegram làm giao diện ra lệnh.
      </div>
    </div>
  );
}