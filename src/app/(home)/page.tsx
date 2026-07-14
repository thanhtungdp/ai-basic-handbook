import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16 max-w-3xl mx-auto">
      <span className="text-sm font-medium text-orange-500 mb-3">
        KADA Training Program
      </span>
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
        Từ hiểu AI đến ship sản phẩm có business model
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl">
        8 ngày × 6 giờ. Hands-on Claude, prompting có kiểm chứng,
        structured content, workflow automation — kết thúc bằng capstone sản phẩm end-to-end.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          href="/docs"
          className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          Xem chương trình →
        </Link>
        <Link
          href="/docs/module-1-ai-foundation"
          className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
        >
          Module 1 — AI Foundation
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">8</div>
          <div className="text-sm font-medium mb-1">Ngày học</div>
          <div className="text-xs text-muted-foreground">
            5 ngày Foundation + 3 ngày Capstone
          </div>
        </div>
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">2</div>
          <div className="text-sm font-medium mb-1">Module</div>
          <div className="text-xs text-muted-foreground">
            AI Foundation & Integrated Capstone
          </div>
        </div>
        <div className="rounded-lg border border-border p-4 text-left">
          <div className="text-2xl font-bold text-orange-500 mb-1">1</div>
          <div className="text-sm font-medium mb-1">Sản phẩm thật</div>
          <div className="text-xs text-muted-foreground">
            Ship end-to-end có BMC, pricing, GTM
          </div>
        </div>
      </div>
      <div className="mt-10 text-sm text-muted-foreground max-w-lg">
        Hands-on Claude là primary tool. Giới thiệu ChatGPT Work và Hermes Agent (always-on 24/7).
        Kết thúc có portfolio: GitHub README, CV, promo video, social images.
      </div>
    </div>
  );
}