import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageTemplate } from "@/components/sections/seo-landing";

export const metadata = buildMetadata({
  title: "Best Vocational Courses After 12th",
  description: "Explore top vocational courses after 12th with diploma, advanced diploma, and bachelor vocational pathways.",
  path: "/best-vocational-courses-after-12th",
});

export default function BestVocationalAfter12thPage() {
  return (
    <SeoLandingPageTemplate
      title="Best Vocational Courses After 12th: Job-Focused Programs"
      intro="Choose vocational pathways with clear exit options: Diploma (1 year), Advanced Diploma (2 years), and Bachelor Vocational degree (3 years)."
      bullets={[
        "Domain-based tracks: Agriculture, Automobile, IT, Hospitality, and more.",
        "Structured progression from Diploma to Bachelor Vocational.",
        "Skill-focused curriculum with practical outcomes.",
        "Counselling support for stream and career selection.",
      ]}
      faqs={[
        { q: "Which vocational course is best after 12th?", a: "The best course depends on your domain interest, career goal, and budget." },
        { q: "Are vocational programs job-oriented?", a: "Yes, vocational tracks are designed for practical employability and skill outcomes." },
        { q: "Can I continue higher studies after vocational degree?", a: "Yes, Bachelor Vocational pathways can support progression to advanced studies." },
      ]}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Best Vocational Courses After 12th", url: "/best-vocational-courses-after-12th" },
      ]}
    />
  );
}

