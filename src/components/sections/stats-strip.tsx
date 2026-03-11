import { GraduationCap, School2, Users, Layers3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export function StatsStrip({
  students,
  courses,
  universities,
}: {
  students: number;
  courses: number;
  universities: number;
}) {
  const stats = [
    {
      label: "Students Enrolled",
      value: `${formatNumber(Math.max(students, 7200))}+`,
      icon: Users,
      tone: "from-blue-700/10 to-cyan-600/10 text-blue-700",
    },
    {
      label: "Courses",
      value: `${formatNumber(Math.max(courses, 1200))}+`,
      icon: GraduationCap,
      tone: "from-indigo-700/10 to-blue-700/10 text-indigo-700",
    },
    {
      label: "Universities",
      value: `${formatNumber(Math.max(universities, 12))}+`,
      icon: School2,
      tone: "from-teal-700/10 to-blue-700/10 text-teal-700",
    },
    {
      label: "Sectors",
      value: "40+",
      icon: Layers3,
      tone: "from-blue-700/10 to-violet-700/10 text-blue-700",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/10">
          <CardContent className="relative p-6">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.tone}`} />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
              </div>
              <span className="rounded-xl bg-white p-2 shadow-sm">
                <stat.icon className="h-5 w-5 text-blue-700" />
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
