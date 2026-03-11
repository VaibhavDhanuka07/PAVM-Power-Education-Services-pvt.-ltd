"use client";

import { useEffect, useMemo, useState } from "react";
import { FileImage, Loader2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  ADMISSION_SESSION_OPTIONS,
  ADMISSION_TYPE_OPTIONS,
  CATEGORY_OPTIONS,
  COURSE_TYPE_OPTIONS,
  EMPLOYMENT_OPTIONS,
  GENDER_OPTIONS,
  getAcademicRequirements,
  getRequiredDocuments,
  MARITAL_STATUS_OPTIONS,
  PROGRAM_MODE_OPTIONS,
  RESULT_OPTIONS,
  SEMESTER_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  VOCATIONAL_LEVEL_OPTIONS,
} from "@/lib/admissions/config";
import {
  AdmissionAcademicRecord,
  AdmissionCourseType,
  AdmissionDocument,
  AdmissionLevel,
  AdmissionProgramMode,
  AdmissionType,
} from "@/lib/types";

type CourseOption = {
  id: string;
  name: string;
};

type Props = {
  role: "associate" | "student";
  courseOptions: CourseOption[];
  prefill?: {
    admission_session?: string;
    admission_type?: AdmissionType;
    program_mode?: AdmissionProgramMode;
    course_type?: AdmissionCourseType;
    admission_level?: AdmissionLevel;
    course_name?: string;
    stream_name?: string;
    admission_semester?: string;
  };
  onSubmitted?: () => void;
};

type BasicDetails = {
  full_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  gender: string;
  category: string;
  employment_status: string;
  marital_status: string;
  religion: string;
  aadhar_no: string;
  country_name: string;
  abc_id: string;
  deb_id: string;
};

type PersonalDetails = {
  address: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  email: string;
  alternative_email: string;
  mobile_no: string;
  alternative_mobile_no: string;
};

type AdmissionDocumentMap = Partial<Record<AdmissionDocument["key"], AdmissionDocument>>;

const EMPTY_ACADEMIC: Omit<AdmissionAcademicRecord, "qualification"> = {
  board_or_university: "",
  year_of_passing: "",
  percentage_or_cgpa: "",
  result: "pass",
};

const emptyBasicDetails: BasicDetails = {
  full_name: "",
  father_name: "",
  mother_name: "",
  date_of_birth: "",
  gender: "",
  category: "General",
  employment_status: "Student",
  marital_status: "Single",
  religion: "",
  aadhar_no: "",
  country_name: "India",
  abc_id: "",
  deb_id: "",
};

const emptyPersonalDetails: PersonalDetails = {
  address: "",
  pincode: "",
  city: "",
  district: "",
  state: "",
  email: "",
  alternative_email: "",
  mobile_no: "",
  alternative_mobile_no: "",
};

export function AdmissionSubmissionForm({ role, courseOptions, prefill, onSubmitted }: Props) {
  const [admissionSession, setAdmissionSession] = useState(ADMISSION_SESSION_OPTIONS[0]);
  const [admissionType, setAdmissionType] = useState<AdmissionType>("new");
  const [courseType, setCourseType] = useState<AdmissionCourseType>("ug_course");
  const [programMode, setProgramMode] = useState<AdmissionProgramMode>("online");
  const [admissionLevel, setAdmissionLevel] = useState<AdmissionLevel | "">("");
  const [courseName, setCourseName] = useState("");
  const [streamName, setStreamName] = useState("");
  const [admissionSemester, setAdmissionSemester] = useState("Semester 1");
  const [basicDetails, setBasicDetails] = useState<BasicDetails>(emptyBasicDetails);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(emptyPersonalDetails);
  const [academicDetails, setAcademicDetails] = useState<Record<AdmissionAcademicRecord["qualification"], Omit<AdmissionAcademicRecord, "qualification">>>({
    tenth: { ...EMPTY_ACADEMIC },
    twelfth: { ...EMPTY_ACADEMIC },
    diploma: { ...EMPTY_ACADEMIC },
    graduation: { ...EMPTY_ACADEMIC },
    pg_diploma: { ...EMPTY_ACADEMIC },
  });
  const [documents, setDocuments] = useState<AdmissionDocumentMap>({});
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [prefillApplied, setPrefillApplied] = useState(false);

  const requiredAcademics = useMemo(
    () => getAcademicRequirements(courseType, admissionType),
    [courseType, admissionType],
  );

  const requiredDocuments = useMemo(
    () => getRequiredDocuments(courseType, admissionType, programMode),
    [courseType, admissionType, programMode],
  );

  useEffect(() => {
    if (courseType === "vocational_course") {
      setAdmissionLevel((prev) => (prev && VOCATIONAL_LEVEL_OPTIONS.some((o) => o.value === prev) ? prev : "one_year_diploma"));
      return;
    }
    if (courseType === "skill_course") {
      setAdmissionLevel((prev) => (prev && SKILL_LEVEL_OPTIONS.some((o) => o.value === prev) ? prev : "six_month_certification"));
      return;
    }
    setAdmissionLevel("");
  }, [courseType]);

  useEffect(() => {
    if (!prefill || prefillApplied) return;

    if (prefill.admission_session && ADMISSION_SESSION_OPTIONS.includes(prefill.admission_session)) {
      setAdmissionSession(prefill.admission_session);
    }

    if (prefill.admission_type && ADMISSION_TYPE_OPTIONS.some((item) => item.value === prefill.admission_type)) {
      setAdmissionType(prefill.admission_type);
    }

    if (prefill.program_mode && PROGRAM_MODE_OPTIONS.some((item) => item.value === prefill.program_mode)) {
      setProgramMode(prefill.program_mode);
    }

    if (prefill.course_type && COURSE_TYPE_OPTIONS.some((item) => item.value === prefill.course_type)) {
      setCourseType(prefill.course_type);
    }

    if (prefill.admission_level && [...VOCATIONAL_LEVEL_OPTIONS, ...SKILL_LEVEL_OPTIONS].some((item) => item.value === prefill.admission_level)) {
      setAdmissionLevel(prefill.admission_level);
    }

    if (prefill.course_name) {
      const matched = courseOptions.find((item) => item.name.toLowerCase() === prefill.course_name?.toLowerCase());
      setCourseName(matched?.name ?? prefill.course_name);
    }

    if (prefill.stream_name) {
      setStreamName(prefill.stream_name);
    }

    if (prefill.admission_semester && SEMESTER_OPTIONS.includes(prefill.admission_semester)) {
      setAdmissionSemester(prefill.admission_semester);
    }

    setPrefillApplied(true);
  }, [courseOptions, prefill, prefillApplied]);

  async function readAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  }

  async function handleDocumentUpload(key: AdmissionDocument["key"], label: string, file: File | null) {
    if (!file) return;
    const mime = file.type.toLowerCase();
    const isJpg = mime === "image/jpeg" || mime === "image/jpg";
    if (!isJpg) {
      setStatus(`${label}: only .jpg / .jpeg files are allowed.`);
      return;
    }
    if (file.size > 512000) {
      setStatus(`${label}: file must be under 500KB.`);
      return;
    }

    const dataUrl = await readAsDataUrl(file);
    setDocuments((prev) => ({
      ...prev,
      [key]: {
        key,
        label,
        file_name: file.name,
        mime_type: file.type,
        size_bytes: file.size,
        data_url: dataUrl,
      },
    }));
    setStatus("");
  }

  function resetForm() {
    setAdmissionSession(ADMISSION_SESSION_OPTIONS[0]);
    setAdmissionType("new");
    setCourseType("ug_course");
    setProgramMode("online");
    setAdmissionLevel("");
    setCourseName("");
    setStreamName("");
    setAdmissionSemester("Semester 1");
    setBasicDetails(emptyBasicDetails);
    setPersonalDetails(emptyPersonalDetails);
    setAcademicDetails({
      tenth: { ...EMPTY_ACADEMIC },
      twelfth: { ...EMPTY_ACADEMIC },
      diploma: { ...EMPTY_ACADEMIC },
      graduation: { ...EMPTY_ACADEMIC },
      pg_diploma: { ...EMPTY_ACADEMIC },
    });
    setDocuments({});
    setPrivacyAccepted(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (!privacyAccepted) {
      setStatus("Please accept privacy policy before submission.");
      return;
    }

    const missingDocs = requiredDocuments
      .filter((doc) => doc.required)
      .filter((doc) => !documents[doc.key]);
    if (missingDocs.length > 0) {
      setStatus(`Please upload required documents: ${missingDocs.map((item) => item.label).join(", ")}`);
      return;
    }

    const records: AdmissionAcademicRecord[] = requiredAcademics.map((item) => ({
      qualification: item.qualification,
      ...academicDetails[item.qualification],
    }));

    const payload = {
      admission_session: admissionSession,
      admission_type: admissionType,
      course_type: courseType,
      program_mode: programMode,
      admission_level: admissionLevel || null,
      course_name: courseName,
      stream_name: streamName,
      admission_semester: admissionSemester,
      basic_details: {
        ...basicDetails,
        deb_id: basicDetails.deb_id || null,
      },
      personal_details: {
        ...personalDetails,
        alternative_email: personalDetails.alternative_email || null,
        alternative_mobile_no: personalDetails.alternative_mobile_no || null,
      },
      academic_details: records,
      documents: requiredDocuments
        .map((item) => documents[item.key])
        .filter((item): item is AdmissionDocument => Boolean(item)),
      privacy_accepted: privacyAccepted,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatus(json.error || "Failed to submit admission.");
        return;
      }

      setStatus("Admission submitted successfully and sent to admin for review.");
      resetForm();
      onSubmitted?.();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          {role === "associate" ? "Associate Admission Entry" : "Student Admission Form"}
        </h2>
        <p className="text-sm text-slate-600">
          Submit full admission details. Admin will review and approve/reject. Status and notices will be visible in dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Admission Details</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Select value={admissionSession} onChange={(event) => setAdmissionSession(event.target.value)}>
              {ADMISSION_SESSION_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>

            <Select value={admissionType} onChange={(event) => setAdmissionType(event.target.value as AdmissionType)}>
              {ADMISSION_TYPE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>

            <Select value={courseType} onChange={(event) => setCourseType(event.target.value as AdmissionCourseType)}>
              {COURSE_TYPE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>

            <Select value={programMode} onChange={(event) => setProgramMode(event.target.value as AdmissionProgramMode)}>
              {PROGRAM_MODE_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>

            {courseType === "vocational_course" ? (
              <Select value={admissionLevel} onChange={(event) => setAdmissionLevel(event.target.value as AdmissionLevel)}>
                {VOCATIONAL_LEVEL_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
            ) : null}

            {courseType === "skill_course" ? (
              <Select value={admissionLevel} onChange={(event) => setAdmissionLevel(event.target.value as AdmissionLevel)}>
                {SKILL_LEVEL_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
            ) : null}

            <Select value={courseName} onChange={(event) => setCourseName(event.target.value)} required>
              <option value="">Select course name</option>
              {courseOptions.map((item) => (
                <option key={item.id} value={item.name}>{item.name}</option>
              ))}
            </Select>
            <Input
              value={streamName}
              onChange={(event) => setStreamName(event.target.value)}
              placeholder="Stream name"
              required
            />
            <Select value={admissionSemester} onChange={(event) => setAdmissionSemester(event.target.value)}>
              {SEMESTER_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Basic Details</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input value={basicDetails.full_name} onChange={(e) => setBasicDetails({ ...basicDetails, full_name: e.target.value })} placeholder="Full Name" required />
            <Input value={basicDetails.father_name} onChange={(e) => setBasicDetails({ ...basicDetails, father_name: e.target.value })} placeholder="Father's Name" required />
            <Input value={basicDetails.mother_name} onChange={(e) => setBasicDetails({ ...basicDetails, mother_name: e.target.value })} placeholder="Mother's Name" required />
            <Input type="date" value={basicDetails.date_of_birth} onChange={(e) => setBasicDetails({ ...basicDetails, date_of_birth: e.target.value })} required />
            <Select value={basicDetails.gender} onChange={(e) => setBasicDetails({ ...basicDetails, gender: e.target.value })} required>
              <option value="">Gender</option>
              {GENDER_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
            <Select value={basicDetails.category} onChange={(e) => setBasicDetails({ ...basicDetails, category: e.target.value })}>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
            <Select value={basicDetails.employment_status} onChange={(e) => setBasicDetails({ ...basicDetails, employment_status: e.target.value })}>
              {EMPLOYMENT_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
            <Select value={basicDetails.marital_status} onChange={(e) => setBasicDetails({ ...basicDetails, marital_status: e.target.value })}>
              {MARITAL_STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </Select>
            <Input value={basicDetails.religion} onChange={(e) => setBasicDetails({ ...basicDetails, religion: e.target.value })} placeholder="Religion" required />
            <Input value={basicDetails.aadhar_no} onChange={(e) => setBasicDetails({ ...basicDetails, aadhar_no: e.target.value.replace(/[^\d]/g, "").slice(0, 12) })} placeholder="Aadhar Number (12 digits)" minLength={12} maxLength={12} required />
            <Input value={basicDetails.country_name} onChange={(e) => setBasicDetails({ ...basicDetails, country_name: e.target.value })} placeholder="Country Name" required />
            <Input value={basicDetails.abc_id} onChange={(e) => setBasicDetails({ ...basicDetails, abc_id: e.target.value })} placeholder="ABC ID" required />
            <Input value={basicDetails.deb_id} onChange={(e) => setBasicDetails({ ...basicDetails, deb_id: e.target.value })} placeholder="DEB ID (Required for online mode)" required={programMode === "online"} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Personal Details</h3>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Textarea
              className="md:col-span-2 xl:col-span-3"
              value={personalDetails.address}
              onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
              placeholder="Full Address"
              required
            />
            <Input value={personalDetails.pincode} onChange={(e) => setPersonalDetails({ ...personalDetails, pincode: e.target.value })} placeholder="Pincode" required />
            <Input value={personalDetails.city} onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })} placeholder="City" required />
            <Input value={personalDetails.district} onChange={(e) => setPersonalDetails({ ...personalDetails, district: e.target.value })} placeholder="District" required />
            <Input value={personalDetails.state} onChange={(e) => setPersonalDetails({ ...personalDetails, state: e.target.value })} placeholder="State" required />
            <Input type="email" value={personalDetails.email} onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })} placeholder="Email" required />
            <Input type="email" value={personalDetails.alternative_email} onChange={(e) => setPersonalDetails({ ...personalDetails, alternative_email: e.target.value })} placeholder="Alternative Email (optional)" />
            <Input value={personalDetails.mobile_no} onChange={(e) => setPersonalDetails({ ...personalDetails, mobile_no: e.target.value })} placeholder="Mobile Number" required />
            <Input value={personalDetails.alternative_mobile_no} onChange={(e) => setPersonalDetails({ ...personalDetails, alternative_mobile_no: e.target.value })} placeholder="Alternative Mobile Number (optional)" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Academic Details</h3>
          <div className="space-y-3">
            {requiredAcademics.map((item) => (
              <div key={item.qualification} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">{item.label}</p>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Input
                    value={academicDetails[item.qualification].board_or_university}
                    onChange={(event) => setAcademicDetails((prev) => ({
                      ...prev,
                      [item.qualification]: {
                        ...prev[item.qualification],
                        board_or_university: event.target.value,
                      },
                    }))}
                    placeholder="Board / University Name"
                    required
                  />
                  <Input
                    value={academicDetails[item.qualification].year_of_passing}
                    onChange={(event) => setAcademicDetails((prev) => ({
                      ...prev,
                      [item.qualification]: {
                        ...prev[item.qualification],
                        year_of_passing: event.target.value,
                      },
                    }))}
                    placeholder="Year of Passing"
                    required
                  />
                  <Input
                    value={academicDetails[item.qualification].percentage_or_cgpa}
                    onChange={(event) => setAcademicDetails((prev) => ({
                      ...prev,
                      [item.qualification]: {
                        ...prev[item.qualification],
                        percentage_or_cgpa: event.target.value,
                      },
                    }))}
                    placeholder="% Marks / CGPA"
                    required
                  />
                  <Select
                    value={academicDetails[item.qualification].result}
                    onChange={(event) => setAcademicDetails((prev) => ({
                      ...prev,
                      [item.qualification]: {
                        ...prev[item.qualification],
                        result: event.target.value as AdmissionAcademicRecord["result"],
                      },
                    }))}
                  >
                    {RESULT_OPTIONS.map((result) => (
                      <option key={result} value={result}>
                        {result.toUpperCase()}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Documents Upload (.jpg only, max 500KB each)</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {requiredDocuments.map((doc) => (
              <div key={doc.key} className="rounded-xl border border-slate-200 p-3">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {doc.label}
                  {doc.required ? <span className="ml-1 text-red-600">*</span> : null}
                </label>
                <Input
                  type="file"
                  accept=".jpg,.jpeg,image/jpeg,image/jpg"
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    void handleDocumentUpload(doc.key, doc.label, file);
                  }}
                  required={doc.required}
                />
                {documents[doc.key] ? (
                  <p className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-700">
                    <FileImage className="h-3.5 w-3.5" />
                    Uploaded: {documents[doc.key]?.file_name}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <label className="inline-flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={privacyAccepted}
              onChange={(event) => setPrivacyAccepted(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              I confirm the student has reviewed and accepted the privacy policy and data processing consent.
              Please review{" "}
              <a href="/privacy-security" target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline">
                Privacy & Security Policy
              </a>{" "}
              before final submission.
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Admission...
              </>
            ) : (
              "Submit Admission to Admin"
            )}
          </Button>
          <span className="inline-flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Role: {role === "associate" ? "Associate Authority" : "Student Authority"}
          </span>
        </div>
      </form>

      {status ? (
        <p className={`mt-4 text-sm ${status.toLowerCase().includes("successfully") ? "text-emerald-700" : "text-rose-700"}`}>
          {status}
        </p>
      ) : null}
    </Card>
  );
}
