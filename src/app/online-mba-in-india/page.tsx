import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageTemplate } from "@/components/sections/seo-landing";

export const metadata = buildMetadata({
  title: "Online MBA in India",
  description: "Compare top online MBA universities in India with fees, duration, and counselling support.",
  path: "/online-mba-in-india",
});

export default function OnlineMbaInIndiaPage() {
  return (
    <SeoLandingPageTemplate
      title="Online MBA in India: Universities, Fees, Eligibility"
      intro="Explore accredited online MBA programs across top universities with updated fee ranges, duration, and admission guidance."
      bullets={[
        "Compare mode-wise MBA options (Online, Distance, Regular).",
        "Check fee ranges and semester breakup before applying.",
        "Shortlist based on career goals like Marketing, HR, Finance, Analytics.",
        "Get counselling support for eligibility and documentation.",
      ]}
      faqs={[
        { q: "Is online MBA valid in India?", a: "Yes, when offered by recognized universities under applicable UGC/DEB norms." },
        { q: "What is the fee range for online MBA?", a: "Fee range depends on university and specialisation; compare options before finalizing." },
        { q: "Can working professionals pursue online MBA?", a: "Yes, online MBA is a preferred choice for working professionals due to flexibility." },
      ]}
      breadcrumbs={[
        { name: "Home", url: "/".replace(/$/, "") },
        { name: "Online MBA in India", url: "/online-mba-in-india" },
      ]}
    />
  );
}

