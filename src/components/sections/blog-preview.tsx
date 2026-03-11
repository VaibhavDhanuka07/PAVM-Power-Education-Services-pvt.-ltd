import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/sections/fade-in";

export function BlogPreview({ blogs }: { blogs: Blog[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {blogs.slice(0, 3).map((blog, index) => (
        <FadeIn key={blog.id} delay={index * 0.06}>
          <Card className="group overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10">
          {blog.image ? (
            <div className="relative h-44 w-full">
              <Image src={blog.image} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
            </div>
          ) : (
            <div className="h-44 w-full bg-slate-100" />
          )}
          <CardContent className="p-5">
            <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{blog.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blog.excerpt || blog.content}</p>
            <Link href={`/blog/${blog.slug}`} className="mt-4 inline-block text-sm font-semibold text-blue-700">Read article</Link>
          </CardContent>
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}

