import { buildMetadata } from "@/lib/seo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = buildMetadata({
  title: "Login",
  description: "Login to manage shortlist, reviews, and applications.",
  path: "/login",
});

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const nextPath = searchParams?.next && searchParams.next.startsWith("/") ? searchParams.next : "/";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <LoginForm nextPath={nextPath} />
    </section>
  );
}
