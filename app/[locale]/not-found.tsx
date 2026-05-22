import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[80vh] grid place-items-center px-6 py-24">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-eyebrow uppercase text-accent-1 mb-4">
          404
        </p>
        <h1 className="text-4xl font-bold mb-3">页面未找到 · Not found</h1>
        <p className="text-fg-body mb-8">
          你访问的页面不存在或已被移动。
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-accent-grad text-white px-5 h-11 text-[15px] font-medium shadow-pill hover:-translate-y-0.5 transition-transform"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
