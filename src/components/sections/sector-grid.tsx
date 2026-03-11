import { Briefcase, Cpu, Plane, Landmark, Stethoscope, Wheat, Hotel, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const sectors = [
  { name: "Management", icon: Briefcase },
  { name: "Agriculture", icon: Wheat },
  { name: "Computing", icon: Cpu },
  { name: "Aviation", icon: Plane },
  { name: "Hotel Management", icon: Hotel },
  { name: "Engineering", icon: Building2 },
  { name: "Healthcare", icon: Stethoscope },
  { name: "Finance", icon: Landmark },
];

export function SectorGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((sector) => (
        <Card
          key={sector.name}
          className="group rounded-2xl border-slate-200 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/10 active:scale-[0.99]"
        >
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700 transition group-hover:bg-blue-100">
              <sector.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{sector.name}</p>
              <p className="text-xs text-slate-500">Explore programs</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
