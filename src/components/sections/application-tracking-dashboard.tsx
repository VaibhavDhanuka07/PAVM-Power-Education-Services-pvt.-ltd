"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import { CheckCircle2, CircleDashed, FileText, GraduationCap, Upload, Wallet } from "lucide-react";

type Stage = "enquiry" | "docs" | "admission" | "fee-payment" | "enrolled";
const KEY = "pavm-application-status";

const stageMeta: Array<{ id: Stage; title: string; icon: ComponentType<{ className?: string }> }> = [
  { id: "enquiry", title: "Enquiry", icon: CircleDashed },
  { id: "docs", title: "Documents Submitted", icon: Upload },
  { id: "admission", title: "Admission Confirmed", icon: FileText },
  { id: "fee-payment", title: "Fee Payment", icon: Wallet },
  { id: "enrolled", title: "Enrolled", icon: GraduationCap },
];

export function ApplicationTrackingDashboard() {
  const [appId, setAppId] = useState("APP-1001");
  const [statusMap, setStatusMap] = useState<Record<string, Stage>>({});
  const [adminMode, setAdminMode] = useState(false);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, Stage>;
    setStatusMap(current);
    const bc = new BroadcastChannel("pavm-application-tracker");
    bc.onmessage = (event) => {
      if (event.data?.type === "status:update") {
        const next = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, Stage>;
        setStatusMap(next);
      }
    };
    setChannel(bc);
    return () => bc.close();
  }, []);

  const currentStage = statusMap[appId] ?? "enquiry";
  const currentIdx = stageMeta.findIndex((s) => s.id === currentStage);

  const progress = useMemo(() => ((currentIdx + 1) / stageMeta.length) * 100, [currentIdx]);

  function updateStatus(nextStage: Stage) {
    const next = { ...statusMap, [appId]: nextStage };
    setStatusMap(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    channel?.postMessage({ type: "status:update", appId, stage: nextStage });
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Application Tracking Dashboard</h1>
        <p className="mt-2 text-slate-600">Track student journey in real time: enquiry → docs → admission → fee payment → enrolled.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">Application ID</label>
          <input value={appId} onChange={(e) => setAppId(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm" />
          <label className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={adminMode} onChange={(e) => setAdminMode(e.target.checked)} />
            Admin update mode
          </label>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          {stageMeta.map((stage, idx) => {
            const done = idx <= currentIdx;
            const Icon = stage.icon;
            return (
              <div key={stage.id} className={`rounded-xl border p-3 ${done ? "border-blue-200 bg-blue-50" : "border-slate-200 bg-white"}`}>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  {done ? <CheckCircle2 className="h-4 w-4 text-blue-700" /> : <Icon className="h-4 w-4 text-slate-500" />}
                  {stage.title}
                </p>
                {adminMode ? (
                  <button
                    type="button"
                    onClick={() => updateStatus(stage.id)}
                    className="mt-2 rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-700"
                  >
                    Set stage
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
