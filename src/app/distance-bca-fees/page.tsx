import { buildMetadata } from "@/lib/seo";
import { SeoLandingPageTemplate } from "@/components/sections/seo-landing";

export const metadata = buildMetadata({
  title: "Distance BCA Fees",
  description: "Find distance BCA fee structure, duration, and top university options in India.",
  path: "/distance-bca-fees",
});

export default function DistanceBcaFeesPage() {
  return (
    <SeoLandingPageTemplate
      title="Distance BCA Fees in India: University-wise Guide"
      intro="Compare distance BCA programs by fees, duration, and support services to choose the right university for your budget."
      bullets={[
        "Understand annual and semester-wise BCA fee structures.",
        "Check eligibility for distance BCA admission.",
        "Compare LMS support and academic assistance.",
        "Get a personalized shortlist based on city and budget.",
      ]}
      faqs={[
        { q: "What is the duration of distance BCA?", a: "Typically 3 years, depending on university policy and regulations." },
        { q: "Can I pursue distance BCA while working?", a: "Yes, distance mode is suitable for learners requiring flexible schedules." },
        { q: "Do distance BCA programs include placement support?", a: "Many universities provide career guidance and support; compare before enrolling." },
      ]}
      breadcrumbs={[
        { name: "Home", url: "/" },
        { name: "Distance BCA Fees", url: "/distance-bca-fees" },
      ]}
    />
  );
}

