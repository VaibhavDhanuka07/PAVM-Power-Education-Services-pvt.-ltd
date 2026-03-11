import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-4xl font-bold">Page not found</h1>
      <p className="mt-3 text-slate-600">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-sm font-semibold text-blue-700">Back to home</Link>
    </section>
  );
}


