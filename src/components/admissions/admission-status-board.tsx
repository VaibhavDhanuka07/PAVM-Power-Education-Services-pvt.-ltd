"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { AdmissionNotice, AdmissionRecord, AdmissionStatusLog } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Props = {
  role: "associate" | "student" | "admin";
  initialAdmissions: AdmissionRecord[];
};

function getStatusClasses(status: AdmissionRecord["status"]) {
  if (status === "accepted") return "bg-emerald-100 text-emerald-700";
  if (status === "rejected") return "bg-rose-100 text-rose-700";
  if (status === "under_review") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

export function AdmissionStatusBoard({ role, initialAdmissions }: Props) {
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>(initialAdmissions);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>(initialAdmissions[0]?.id ?? "");
  const [logs, setLogs] = useState<AdmissionStatusLog[]>([]);
  const [notices, setNotices] = useState<AdmissionNotice[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const selectedAdmission = useMemo(
    () => admissions.find((item) => item.id === selectedAdmissionId) ?? null,
    [admissions, selectedAdmissionId],
  );

  const semesterFees = useMemo(() => {
    if (!selectedAdmission) return [];
    return Array.isArray(selectedAdmission.semester_fees) ? selectedAdmission.semester_fees : [];
  }, [selectedAdmission]);

  const feeTotals = useMemo(() => {
    if (!semesterFees.length) return null;
    return semesterFees.reduce(
      (acc, row) => ({
        paid: acc.paid + (row.paid ?? 0),
        due: acc.due + (row.due ?? 0),
      }),
      { paid: 0, due: 0 },
    );
  }, [semesterFees]);

  async function loadAdmissions() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/admissions");
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to load admissions.");
        return;
      }
      const nextAdmissions = (json.data ?? []) as AdmissionRecord[];
      setAdmissions(nextAdmissions);
      if (!nextAdmissions.some((item) => item.id === selectedAdmissionId)) {
        setSelectedAdmissionId(nextAdmissions[0]?.id ?? "");
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadLogsAndNotices(admissionId: string) {
    if (!admissionId) {
      setLogs([]);
      setNotices([]);
      return;
    }

    const [logsRes, noticesRes] = await Promise.all([
      fetch(`/api/admissions/logs?admission_id=${encodeURIComponent(admissionId)}`),
      fetch(`/api/admissions/notices?admission_id=${encodeURIComponent(admissionId)}`),
    ]);

    const logsJson = await logsRes.json().catch(() => ({}));
    const noticesJson = await noticesRes.json().catch(() => ({}));

    if (logsRes.ok) setLogs((logsJson.data ?? []) as AdmissionStatusLog[]);
    if (noticesRes.ok) setNotices((noticesJson.data ?? []) as AdmissionNotice[]);
  }

  useEffect(() => {
    void loadLogsAndNotices(selectedAdmissionId);
  }, [selectedAdmissionId]);

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Admission Status Tracker</h3>
            <p className="text-sm text-slate-600">
              {role === "admin"
                ? "All applications are visible here."
                : "Track each submitted admission, admin decision, and notices/datesheets."}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadAdmissions()} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-900">{admissions.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Submitted</p>
            <p className="text-2xl font-bold text-blue-700">{admissions.filter((a) => a.status === "submitted").length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Under Review</p>
            <p className="text-2xl font-bold text-amber-700">{admissions.filter((a) => a.status === "under_review").length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Accepted</p>
            <p className="text-2xl font-bold text-emerald-700">{admissions.filter((a) => a.status === "accepted").length}</p>
          </div>
        </div>
      </Card>

      {admissions.length > 0 ? (
        <Card className="rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">Select Admission</label>
              <Select value={selectedAdmissionId} onChange={(event) => setSelectedAdmissionId(event.target.value)}>
                {admissions.map((admission) => (
                  <option key={admission.id} value={admission.id}>
                    {admission.basic_details.full_name} - {admission.course_name}
                  </option>
                ))}
              </Select>

              <div className="mt-4 space-y-2">
                {admissions.map((admission) => (
                  <button
                    key={admission.id}
                    onClick={() => setSelectedAdmissionId(admission.id)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      admission.id === selectedAdmissionId
                        ? "border-blue-300 bg-blue-50 text-blue-800"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    <p className="font-semibold">{admission.basic_details.full_name}</p>
                    <p className="text-xs">{admission.course_name} | {admission.program_mode}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              {selectedAdmission ? (
                <>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{selectedAdmission.basic_details.full_name}</p>
                        <p className="text-sm text-slate-600">
                          {selectedAdmission.course_name} • {selectedAdmission.stream_name} • {selectedAdmission.program_mode}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClasses(selectedAdmission.status)}`}>
                        {selectedAdmission.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                      <p>Session: <span className="font-semibold">{selectedAdmission.admission_session}</span></p>
                      <p>Semester: <span className="font-semibold">{selectedAdmission.admission_semester}</span></p>
                      <p>Admission Type: <span className="font-semibold">{selectedAdmission.admission_type.replace("_", " ")}</span></p>
                      <p>Course Type: <span className="font-semibold">{selectedAdmission.course_type.replace("_", " ")}</span></p>
                    </div>
                    {selectedAdmission.status_reason ? (
                      <p className="mt-2 text-sm text-slate-700">
                        <span className="font-semibold">Admin Decision Note:</span> {selectedAdmission.status_reason}
                      </p>
                    ) : null}
                    {((selectedAdmission.associate_discount_amount ?? 0) > 0 || !!selectedAdmission.associate_discount_note) ? (
                      <div className="mt-2 rounded-lg border border-emerald-100 bg-emerald-50/60 p-3 text-sm text-slate-700">
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Associate Discount</p>
                        <p className="mt-1 font-semibold text-emerald-800">
                          {selectedAdmission.associate_discount_amount !== null && selectedAdmission.associate_discount_amount !== undefined
                            ? formatCurrency(selectedAdmission.associate_discount_amount)
                            : "Not set"}
                        </p>
                        {selectedAdmission.associate_discount_note ? (
                          <p className="mt-1 text-xs text-slate-600">{selectedAdmission.associate_discount_note}</p>
                        ) : null}
                        {selectedAdmission.associate_discount_updated_at ? (
                          <p className="mt-1 text-[11px] text-slate-500">
                            Updated: {new Date(selectedAdmission.associate_discount_updated_at).toLocaleString("en-IN")}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Semester Fee Status</p>
                      {semesterFees.length ? (
                        <div className="mt-2 space-y-2">
                          <div className="overflow-auto rounded-lg border border-slate-200">
                            <table className="min-w-full text-sm">
                              <thead className="bg-slate-50 text-left text-slate-600">
                                <tr className="border-b border-slate-200">
                                  <th className="px-3 py-2">Semester</th>
                                  <th className="px-3 py-2">Paid</th>
                                  <th className="px-3 py-2">Pending</th>
                                </tr>
                              </thead>
                              <tbody>
                                {semesterFees.map((row) => (
                                  <tr key={row.semester} className="border-b border-slate-100">
                                    <td className="px-3 py-2">{row.semester}</td>
                                    <td className="px-3 py-2 text-emerald-700">{formatCurrency(row.paid ?? 0)}</td>
                                    <td className="px-3 py-2 text-rose-700">{formatCurrency(row.due ?? 0)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {feeTotals ? (
                            <div className="grid gap-2 text-sm md:grid-cols-2">
                              <p>
                                Total Paid:{" "}
                                <span className="font-semibold text-emerald-700">{formatCurrency(feeTotals.paid)}</span>
                              </p>
                              <p>
                                Total Pending:{" "}
                                <span className="font-semibold text-rose-700">{formatCurrency(feeTotals.due)}</span>
                              </p>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="mt-2 grid gap-2 md:grid-cols-2">
                          <p>
                            Paid:{" "}
                            <span className="font-semibold text-emerald-700">
                              {selectedAdmission.semester_fee_paid !== null && selectedAdmission.semester_fee_paid !== undefined
                                ? formatCurrency(selectedAdmission.semester_fee_paid)
                                : "Not updated"}
                            </span>
                          </p>
                          <p>
                            Pending:{" "}
                            <span className="font-semibold text-rose-700">
                              {selectedAdmission.semester_fee_due !== null && selectedAdmission.semester_fee_due !== undefined
                                ? formatCurrency(selectedAdmission.semester_fee_due)
                                : "Not updated"}
                            </span>
                          </p>
                        </div>
                      )}
                      {selectedAdmission.fee_updated_at ? (
                        <p className="mt-2 text-[11px] text-slate-500">
                          Updated: {new Date(selectedAdmission.fee_updated_at).toLocaleString("en-IN")}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-800">Timeline</p>
                      <div className="space-y-2">
                        {logs.length === 0 ? <p className="text-sm text-slate-500">No timeline events yet.</p> : null}
                        {logs.map((log) => (
                          <div key={log.id} className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                              {log.status === "accepted" ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
                              {log.status === "rejected" ? <XCircle className="h-4 w-4 text-rose-600" /> : null}
                              {log.status === "under_review" ? <Clock3 className="h-4 w-4 text-amber-600" /> : null}
                              {log.status === "submitted" ? <FileText className="h-4 w-4 text-blue-600" /> : null}
                              {log.status.replace("_", " ")}
                            </p>
                            {log.note ? <p className="mt-1 text-xs text-slate-600">{log.note}</p> : null}
                            <p className="mt-1 text-[11px] text-slate-500">
                              <CalendarClock className="mr-1 inline h-3.5 w-3.5" />
                              {new Date(log.updated_at).toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="mb-2 text-sm font-semibold text-slate-800">Admin Notices & Datesheets</p>
                      <div className="space-y-2">
                        {notices.length === 0 ? <p className="text-sm text-slate-500">No notices published yet.</p> : null}
                        {notices.map((notice) => (
                          <div key={notice.id} className="rounded-lg border border-slate-200 bg-white p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{notice.notice_type}</p>
                            <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                            <p className="mt-1 text-xs text-slate-600">{notice.description}</p>
                            {notice.file_url ? (
                              <a
                                href={notice.file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block text-xs font-semibold text-blue-700 underline"
                              >
                                Open attachment
                              </a>
                            ) : null}
                            <p className="mt-1 text-[11px] text-slate-500">
                              {new Date(notice.created_at).toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
          No admissions submitted yet.
        </Card>
      )}

      {status ? <p className="text-sm text-rose-700">{status}</p> : null}
    </div>
  );
}
