import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-400">That island route does not exist yet.</p>
      <Link href="/home" className="mt-6 rounded-2xl bg-cyan-400/15 px-4 py-3 text-cyan-200">
        Back to Home
      </Link>
    </div>
  );
}
