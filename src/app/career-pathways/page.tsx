import { buildMetadata } from "@/lib/seo";
import { getCareerPathways } from "@/lib/queries/career-pathways";
import { CareerPathwaysSection } from "@/components/sections/career-pathways-section";

export const metadata = buildMetadata({
  title: "Career Pathways",
  description: "Integrated coaching + degree pathways for UPSC, CA, CS, GATE, and advanced finance tracks.",
  path: "/career-pathways",
});

export default async function CareerPathwaysPage() {
  const pathways = await getCareerPathways();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <CareerPathwaysSection pathways={pathways} />
    </section>
  );
}

