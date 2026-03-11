"use client";

import { useEffect, useMemo, useState } from "react";
import { AdmissionNotice, AdmissionRecord, AdmissionSemesterFee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  admissions: AdmissionRecord[];
};

const STATUS_OPTIONS: AdmissionRecord["status"][] = [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
];

export function AdminAdmissionsPanel({ admissions: initialAdmissions }: Props) {
  const [admissions, setAdmissions] = useState(initialAdmissions);
  const [search, setSearch] = useState("");
  const [busyKey, setBusyKey] = useState("");
  const [status, setStatus] = useState("");

  const [selectedAdmissionId, setSelectedAdmissionId] = useState(initialAdmissions[0]?.id ?? "");
  const [feeAdmissionId, setFeeAdmissionId] = useState(initialAdmissions[0]?.id ?? "");
  const [feeRows, setFeeRows] = useState<AdmissionSemesterFee[]>(() => {
    const initial = initialAdmissions[0]?.semester_fees ?? [];
    return initial.map((row) => ({ ...row }));
  });
  const [discountAdmissionId, setDiscountAdmissionId] = useState(initialAdmissions[0]?.id ?? "");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [discountNote, setDiscountNote] = useState("");
  const [noticeType, setNoticeType] = useState<AdmissionNotice["notice_type"]>("notice");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeDescription, setNoticeDescription] = useState("");
  const [noticeFileUrl, setNoticeFileUrl] = useState("");
  const [visibleToStudent, setVisibleToStudent] = useState(true);
  const [visibleToAssociate, setVisibleToAssociate] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return admissions;
    return admissions.filter((item) =>
      [
        item.basic_details.full_name,
        item.course_name,
        item.stream_name,
        item.program_mode,
        item.status,
        item.admission_session,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [admissions, search]);

  useEffect(() => {
    if (!feeAdmissionId) {
      setFeeRows([]);
      return;
    }
    const admission = admissions.find((item) => item.id === feeAdmissionId);
    setFeeRows((admission?.semester_fees ?? []).map((row) => ({ ...row })));
  }, [feeAdmissionId, admissions]);

  useEffect(() => {
    if (!discountAdmissionId) {
      setDiscountAmount("");
      setDiscountNote("");
      return;
    }
    const admission = admissions.find((item) => item.id === discountAdmissionId);
    setDiscountAmount(
      admission?.associate_discount_amount !== null && admission?.associate_discount_amount !== undefined
        ? String(admission.associate_discount_amount)
        : "",
    );
    setDiscountNote(admission?.associate_discount_note ?? "");
  }, [discountAdmissionId, admissions]);

  async function updateStatus(
    admissionId: string,
    nextStatus: AdmissionRecord["status"],
    reason: string,
    notes: string,
  ) {
    setBusyKey(`status-${admissionId}`);
    setStatus("");
    try {
      const response = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admission_id: admissionId,
          status: nextStatus,
          status_reason: reason || null,
          admin_notes: notes || null,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to update admission status.");
        return;
      }

      setAdmissions((prev) =>
        prev.map((item) =>
          item.id === admissionId
            ? {
                ...item,
                status: nextStatus,
                status_reason: reason || null,
                admin_notes: notes || null,
                status_updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setStatus("Admission status updated.");
    } finally {
      setBusyKey("");
    }
  }

  async function publishNotice() {
    if (!selectedAdmissionId) {
      setStatus("Select an admission to publish notice.");
      return;
    }
    if (!noticeTitle.trim() || !noticeDescription.trim()) {
      setStatus("Notice title and description are required.");
      return;
    }

    setBusyKey("notice");
    setStatus("");
    try {
      const response = await fetch("/api/admissions/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admission_id: selectedAdmissionId,
          notice_type: noticeType,
          title: noticeTitle.trim(),
          description: noticeDescription.trim(),
          file_url: noticeFileUrl.trim() || null,
          visible_to_student: visibleToStudent,
          visible_to_associate: visibleToAssociate,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to publish notice.");
        return;
      }

      setNoticeTitle("");
      setNoticeDescription("");
      setNoticeFileUrl("");
      setStatus("Notice published successfully.");
    } finally {
      setBusyKey("");
    }
  }

  const formatFeeValue = (value: number | null | undefined) => (value === null || value === undefined ? "" : String(value));

  const parseFeeInput = (value: string) => {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const normalizeFeeRows = (rows: AdmissionSemesterFee[]) =>
    rows
      .map((row) => ({
        semester: row.semester.trim(),
        paid: Number.isFinite(row.paid) ? row.paid : 0,
        due: Number.isFinite(row.due) ? row.due : 0,
        updated_at: new Date().toISOString(),
      }))
      .filter((row) => row.semester);

  const parseDiscountInput = (value: string) => {
    const cleaned = value.replace(/,/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  async function updateFees() {
    if (!feeAdmissionId) {
      setStatus("Select an admission to update fees.");
      return;
    }

    const admission = admissions.find((item) => item.id === feeAdmissionId);
    if (!admission) {
      setStatus("Admission not found.");
      return;
    }

    const cleanedRows = normalizeFeeRows(feeRows);
    setBusyKey(`fees-${feeAdmissionId}`);
    setStatus("");

    try {
      const response = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admission_id: feeAdmissionId,
          semester_fees: cleanedRows,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to update semester fees.");
        return;
      }

      setAdmissions((prev) =>
        prev.map((item) =>
          item.id === feeAdmissionId
            ? {
                ...item,
                semester_fees: cleanedRows,
                fee_updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setStatus("Semester fees updated.");
    } finally {
      setBusyKey("");
    }
  }

  async function updateAssociateDiscount() {
    if (!discountAdmissionId) {
      setStatus("Select an admission to update associate discount.");
      return;
    }

    setBusyKey(`discount-${discountAdmissionId}`);
    setStatus("");

    try {
      const response = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admission_id: discountAdmissionId,
          associate_discount_amount: parseDiscountInput(discountAmount),
          associate_discount_note: discountNote.trim() || null,
        }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to update associate discount.");
        return;
      }

      setAdmissions((prev) =>
        prev.map((item) =>
          item.id === discountAdmissionId
            ? {
                ...item,
                associate_discount_amount: parseDiscountInput(discountAmount),
                associate_discount_note: discountNote.trim() || null,
                associate_discount_updated_at: new Date().toISOString(),
              }
            : item,
        ),
      );
      setStatus("Associate discount updated.");
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold">Admission Approval Queue</h2>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by student/course/mode..."
            className="w-full md:max-w-sm"
          />
        </div>

        <div className="max-h-[440px] overflow-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-3 py-2">Student</th>
                <th className="px-3 py-2">Program</th>
                <th className="px-3 py-2">Mode</th>
                <th className="px-3 py-2">Submitted By</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Admin Notes</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((admission) => {
                const isBusy = busyKey === `status-${admission.id}`;
                const submitter =
                  admission.created_by_role === "associate" || admission.associate_user_id
                    ? "Associate"
                    : "Student";
                return (
                  <tr key={admission.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-2">
                      <p className="font-semibold text-slate-900">{admission.basic_details.full_name}</p>
                      <p className="text-xs text-slate-500">{admission.personal_details.mobile_no}</p>
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-800">{admission.course_name}</p>
                      <p className="text-xs text-slate-500">{admission.stream_name}</p>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{admission.program_mode}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {submitter}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Select
                        defaultValue={admission.status}
                        onChange={(event) => {
                          setAdmissions((prev) =>
                            prev.map((item) =>
                              item.id === admission.id
                                ? { ...item, status: event.target.value as AdmissionRecord["status"] }
                                : item,
                            ),
                          );
                        }}
                        className="h-9"
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <option key={item} value={item}>
                            {item.replace("_", " ")}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        defaultValue={admission.status_reason ?? ""}
                        onChange={(event) =>
                          setAdmissions((prev) =>
                            prev.map((item) =>
                              item.id === admission.id ? { ...item, status_reason: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Decision reason"
                        className="h-9 min-w-[170px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        defaultValue={admission.admin_notes ?? ""}
                        onChange={(event) =>
                          setAdmissions((prev) =>
                            prev.map((item) =>
                              item.id === admission.id ? { ...item, admin_notes: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Internal note"
                        className="h-9 min-w-[170px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        size="sm"
                        disabled={isBusy}
                        onClick={() =>
                          updateStatus(
                            admission.id,
                            admission.status,
                            admission.status_reason ?? "",
                            admission.admin_notes ?? "",
                          )
                        }
                      >
                        {isBusy ? "Saving..." : "Save"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-500">
                    No admissions found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="mb-4 text-lg font-semibold">Update Semester Fees</h2>
        <div className="grid gap-3">
          <Select value={feeAdmissionId} onChange={(event) => setFeeAdmissionId(event.target.value)}>
            <option value="">Select Admission</option>
            {admissions.map((admission) => (
              <option key={admission.id} value={admission.id}>
                {admission.basic_details.full_name} - {admission.course_name}
              </option>
            ))}
          </Select>

          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2">Semester</th>
                  <th className="px-3 py-2">Paid (INR)</th>
                  <th className="px-3 py-2">Pending (INR)</th>
                  <th className="px-3 py-2">Remove</th>
                </tr>
              </thead>
              <tbody>
                {feeRows.map((row, idx) => (
                  <tr key={`${row.semester}-${idx}`} className="border-b border-slate-100">
                    <td className="px-3 py-2">
                      <Input
                        value={row.semester}
                        onChange={(event) =>
                          setFeeRows((prev) =>
                            prev.map((item, rowIndex) =>
                              rowIndex === idx ? { ...item, semester: event.target.value } : item,
                            ),
                          )
                        }
                        placeholder="Semester 1"
                        className="h-9 min-w-[140px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={formatFeeValue(row.paid)}
                        onChange={(event) =>
                          setFeeRows((prev) =>
                            prev.map((item, rowIndex) =>
                              rowIndex === idx
                                ? { ...item, paid: parseFeeInput(event.target.value) ?? 0 }
                                : item,
                            ),
                          )
                        }
                        placeholder="0"
                        className="h-9 min-w-[120px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={formatFeeValue(row.due)}
                        onChange={(event) =>
                          setFeeRows((prev) =>
                            prev.map((item, rowIndex) =>
                              rowIndex === idx
                                ? { ...item, due: parseFeeInput(event.target.value) ?? 0 }
                                : item,
                            ),
                          )
                        }
                        placeholder="0"
                        className="h-9 min-w-[120px]"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFeeRows((prev) => prev.filter((_, rowIndex) => rowIndex !== idx))}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {feeRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-4 text-center text-sm text-slate-500">
                      No semester fees added.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setFeeRows((prev) => [
                  ...prev,
                  { semester: "", paid: 0, due: 0 },
                ])
              }
            >
              Add Semester
            </Button>
            <Button onClick={updateFees} disabled={busyKey === `fees-${feeAdmissionId}`}>
              {busyKey === `fees-${feeAdmissionId}` ? "Saving..." : "Save Fees"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="mb-4 text-lg font-semibold">Associate Discount</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Select value={discountAdmissionId} onChange={(event) => setDiscountAdmissionId(event.target.value)}>
            <option value="">Select Associate Admission</option>
            {admissions
              .filter((admission) => admission.created_by_role === "associate" || admission.associate_user_id)
              .map((admission) => (
                <option key={admission.id} value={admission.id}>
                  {admission.basic_details.full_name} - {admission.course_name}
                </option>
              ))}
          </Select>
          <Input
            value={discountAmount}
            onChange={(event) => setDiscountAmount(event.target.value)}
            placeholder="Discount amount (INR)"
            className="h-9"
          />
          <Input
            value={discountNote}
            onChange={(event) => setDiscountNote(event.target.value)}
            placeholder="Discount note (optional)"
            className="h-9 md:col-span-2"
          />
        </div>
        <div className="mt-3">
          <Button onClick={updateAssociateDiscount} disabled={busyKey === `discount-${discountAdmissionId}`}>
            {busyKey === `discount-${discountAdmissionId}` ? "Saving..." : "Save Discount"}
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-4">
        <h2 className="mb-4 text-lg font-semibold">Publish Datesheet / Notice</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Select value={selectedAdmissionId} onChange={(event) => setSelectedAdmissionId(event.target.value)}>
            <option value="">Select Admission</option>
            {admissions.map((admission) => (
              <option key={admission.id} value={admission.id}>
                {admission.basic_details.full_name} - {admission.course_name}
              </option>
            ))}
          </Select>
          <Select value={noticeType} onChange={(event) => setNoticeType(event.target.value as AdmissionNotice["notice_type"])}>
            <option value="notice">Notice</option>
            <option value="datesheet">Datesheet</option>
          </Select>
          <Input value={noticeTitle} onChange={(event) => setNoticeTitle(event.target.value)} placeholder="Title" />
          <Input value={noticeFileUrl} onChange={(event) => setNoticeFileUrl(event.target.value)} placeholder="Attachment URL (optional)" />
          <Textarea
            className="md:col-span-2"
            value={noticeDescription}
            onChange={(event) => setNoticeDescription(event.target.value)}
            placeholder="Notice details"
          />
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={visibleToStudent}
              onChange={(event) => setVisibleToStudent(event.target.checked)}
            />
            Visible to student
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={visibleToAssociate}
              onChange={(event) => setVisibleToAssociate(event.target.checked)}
            />
            Visible to associate
          </label>
        </div>
        <div className="mt-3">
          <Button onClick={publishNotice} disabled={busyKey === "notice"}>
            {busyKey === "notice" ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </div>
  );
}
