import { AdmissionAcademicRecord, AdmissionCourseType, AdmissionLevel, AdmissionType } from "@/lib/types";

export const ADMISSION_SESSION_OPTIONS = [
  "January 2026",
  "July 2026",
  "January 2027",
];

export const ADMISSION_TYPE_OPTIONS: Array<{ value: AdmissionType; label: string }> = [
  { value: "new", label: "New Admission" },
  { value: "lateral_entry", label: "Lateral Entry" },
];

export const COURSE_TYPE_OPTIONS: Array<{ value: AdmissionCourseType; label: string }> = [
  { value: "diploma", label: "Diploma Course" },
  { value: "pg_diploma", label: "PG Diploma Course" },
  { value: "ug_course", label: "UG Course" },
  { value: "pg_course", label: "PG Course" },
  { value: "vocational_course", label: "Vocational Course" },
  { value: "skill_course", label: "Skill Course" },
];

export const PROGRAM_MODE_OPTIONS = [
  { value: "regular", label: "Regular Program" },
  { value: "online", label: "Online Program" },
  { value: "distance", label: "Distance Program" },
] as const;

export const VOCATIONAL_LEVEL_OPTIONS: Array<{ value: AdmissionLevel; label: string }> = [
  { value: "one_year_diploma", label: "1 Year Diploma" },
  { value: "two_year_advanced_diploma", label: "2 Year Advanced Diploma" },
  { value: "three_year_bachelors_degree", label: "3 Year Bachelors Degree" },
];

export const SKILL_LEVEL_OPTIONS: Array<{ value: AdmissionLevel; label: string }> = [
  { value: "six_month_certification", label: "6 Months Certification" },
  { value: "eleven_month_diploma", label: "11 Months Diploma Course" },
];

export const SEMESTER_OPTIONS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
];

export const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS", "Other"];
export const GENDER_OPTIONS = ["Male", "Female", "Other"];
export const EMPLOYMENT_OPTIONS = ["Student", "Employed", "Self Employed", "Unemployed"];
export const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Other"];
export const RESULT_OPTIONS: AdmissionAcademicRecord["result"][] = ["pass", "fail"];

export type AcademicRequirement = {
  qualification: AdmissionAcademicRecord["qualification"];
  label: string;
};

export function getAcademicRequirements(
  courseType: AdmissionCourseType,
  admissionType: AdmissionType,
): AcademicRequirement[] {
  const base10and12: AcademicRequirement[] = [
    { qualification: "tenth", label: "10th Board Details" },
    { qualification: "twelfth", label: "12th Board Details" },
  ];

  if (courseType === "skill_course" || courseType === "vocational_course" || courseType === "diploma" || courseType === "ug_course") {
    if (courseType === "ug_course" && admissionType === "lateral_entry") {
      return [...base10and12, { qualification: "diploma", label: "Diploma Board/University Details" }];
    }
    return base10and12;
  }

  if (courseType === "pg_diploma") {
    if (admissionType === "lateral_entry") {
      return [
        ...base10and12,
        { qualification: "graduation", label: "Graduation Degree Details" },
        { qualification: "pg_diploma", label: "PG Diploma Details" },
      ];
    }
    return [...base10and12, { qualification: "graduation", label: "Graduation Degree Details" }];
  }

  if (courseType === "pg_course") {
    if (admissionType === "lateral_entry") {
      return [
        ...base10and12,
        { qualification: "graduation", label: "Graduation Degree Details" },
        { qualification: "pg_diploma", label: "PG Diploma Details (Lateral Entry)" },
      ];
    }
    return [...base10and12, { qualification: "graduation", label: "Graduation Degree Details" }];
  }

  return base10and12;
}

export type RequiredDocument = {
  key:
    | "deb_id_document"
    | "abc_id_document"
    | "marksheet_10_final"
    | "marksheet_12_or_diploma_final"
    | "graduation_marksheet_final"
    | "pg_diploma_document"
    | "aadhar_card"
    | "passport_photo"
    | "student_signature";
  label: string;
  required: boolean;
};

export function getRequiredDocuments(
  courseType: AdmissionCourseType,
  admissionType: AdmissionType,
  programMode: "regular" | "online" | "distance",
): RequiredDocument[] {
  const base: RequiredDocument[] = [
    { key: "abc_id_document", label: "ABC ID Document (.jpg)", required: true },
    { key: "marksheet_10_final", label: "10th Marksheet Final (.jpg)", required: true },
    { key: "marksheet_12_or_diploma_final", label: "12th / Diploma Marksheet Final (.jpg)", required: true },
    { key: "aadhar_card", label: "Address ID Proof (Aadhar Card .jpg)", required: true },
    { key: "passport_photo", label: "Passport Size Photo (.jpg)", required: true },
    { key: "student_signature", label: "Student Signature (.jpg)", required: true },
  ];

  if (programMode === "online") {
    base.unshift({ key: "deb_id_document", label: "DEB ID Document (.jpg)", required: true });
  }

  if (courseType === "pg_course" || courseType === "pg_diploma") {
    base.push({ key: "graduation_marksheet_final", label: "Graduation Marksheet Final (.jpg)", required: true });
  }

  if (
    admissionType === "lateral_entry"
    && (courseType === "pg_course" || courseType === "pg_diploma")
  ) {
    base.push({ key: "pg_diploma_document", label: "PG Diploma Document (.jpg)", required: true });
  }

  return base;
}

