import { buildMetadata } from "@/lib/seo";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata = buildMetadata({
  title: "Sign Up",
  description: "Create account to save shortlisted programs and submit reviews.",
  path: "/signup",
});

export default function SignupPage({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const nextPath = searchParams?.next && searchParams.next.startsWith("/") ? searchParams.next : "/";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <SignupForm nextPath={nextPath} />
    </section>
  );
}
