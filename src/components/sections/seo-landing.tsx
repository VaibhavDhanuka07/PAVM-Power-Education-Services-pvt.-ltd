import Link from "next/link";

type Faq = { q: string; a: string };

export function SeoLandingPageTemplate({
  title,
  intro,
  bullets,
  faqs,
  breadcrumbs,
}: {
  title: string;
  intro: string;
  bullets: string[];
  faqs: Faq[];
  breadcrumbs: Array<{ name: string; url: string }>;
}) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 px-4 py-12 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadSchema) }} />

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-700">{intro}</p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-700">
          {bullets.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="mt-4 space-y-3">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-xl border border-slate-200 p-3">
              <summary className="cursor-pointer font-semibold text-slate-900">{faq.q}</summary>
              <p className="mt-2 text-sm text-slate-700">{faq.a}</p>
            </details>
          ))}
        </div>
      </article>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-sm text-slate-700">Need personalized shortlist and admission support?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link href="/consultation" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Book Free Counselling</Link>
          <Link href="/courses" className="rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">Explore All Courses</Link>
        </div>
      </div>
    </section>
  );
}

