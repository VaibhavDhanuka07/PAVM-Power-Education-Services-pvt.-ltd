import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getBlogs } from "@/lib/queries/blogs";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Education insights, admission tips, and career planning guides.",
  path: "/blog",
});

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="text-3xl font-bold">Education Blog</h1>
      <p className="mt-2 text-slate-600">Guides and insights to make confident academic decisions.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {blogs.map((blog) => (
          <article key={blog.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {blog.image ? (
              <div className="relative h-44 w-full">
                <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
            ) : (
              <div className="h-44 w-full bg-slate-100" />
            )}
            <div className="p-4">
              <h2 className="line-clamp-2 text-lg font-semibold">{blog.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blog.excerpt || blog.content}</p>
              <Link href={`/blog/${blog.slug}`} className="mt-4 inline-block text-sm font-semibold text-blue-700">Read more</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

