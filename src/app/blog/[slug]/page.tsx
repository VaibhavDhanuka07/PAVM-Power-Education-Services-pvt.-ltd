import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getBlogBySlug } from "@/lib/queries/blogs";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) return {};
  return buildMetadata({
    title: blog.title,
    description: blog.excerpt || blog.content.slice(0, 160),
    path: `/blog/${blog.slug}`,
    image: blog.image || undefined,
  });
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogBySlug(params.slug);
  if (!blog) notFound();

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
      {blog.image ? (
        <div className="relative h-72 w-full overflow-hidden rounded-2xl">
          <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
        </div>
      ) : (
        <div className="h-72 w-full rounded-2xl bg-slate-100" />
      )}
      <h1 className="mt-6 text-4xl font-bold text-slate-900">{blog.title}</h1>
      <div className="prose mt-8 max-w-none">
        {blog.content.split("\n").map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
