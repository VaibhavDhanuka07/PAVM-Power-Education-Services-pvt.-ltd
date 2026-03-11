import { z } from "zod";

const admissionStatusValues = [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
] as const;

const admissionTypeValues = ["new", "lateral_entry"] as const;
const courseTypeValues = [
  "diploma",
  "pg_diploma",
  "ug_course",
  "pg_course",
  "vocational_course",
  "skill_course",
] as const;
const programModeValues = ["regular", "online", "distance"] as const;
const admissionLevelValues = [
  "one_year_diploma",
  "two_year_advanced_diploma",
  "three_year_bachelors_degree",
  "six_month_certification",
  "eleven_month_diploma",
] as const;

const academicRecordSchema = z.object({
  qualification: z.enum(["tenth", "twelfth", "diploma", "graduation", "pg_diploma"]),
  board_or_university: z.string().min(2),
  year_of_passing: z.string().min(2),
  percentage_or_cgpa: z.string().min(1),
  result: z.enum(["pass", "fail"]),
});

const admissionDocumentSchema = z.object({
  key: z.enum([
    "deb_id_document",
    "abc_id_document",
    "marksheet_10_final",
    "marksheet_12_or_diploma_final",
    "graduation_marksheet_final",
    "pg_diploma_document",
    "aadhar_card",
    "passport_photo",
    "student_signature",
  ]),
  label: z.string().min(2),
  file_name: z.string().min(1),
  mime_type: z.string().min(3),
  size_bytes: z.number().int().positive().max(512000),
  data_url: z.string().min(30),
});

export const admissionPayloadSchema = z.object({
  admission_session: z.string().min(3),
  admission_type: z.enum(admissionTypeValues),
  course_type: z.enum(courseTypeValues),
  program_mode: z.enum(programModeValues),
  admission_level: z.enum(admissionLevelValues).nullable().optional(),
  course_name: z.string().min(2),
  stream_name: z.string().min(2),
  admission_semester: z.string().min(2),
  basic_details: z.object({
    full_name: z.string().min(2),
    father_name: z.string().min(2),
    mother_name: z.string().min(2),
    date_of_birth: z.string().min(4),
    gender: z.string().min(1),
    category: z.string().min(1),
    employment_status: z.string().min(1),
    marital_status: z.string().min(1),
    religion: z.string().min(1),
    aadhar_no: z.string().min(12).max(12),
    country_name: z.string().min(2),
    abc_id: z.string().min(2),
    deb_id: z.string().nullable().optional(),
  }),
  personal_details: z.object({
    address: z.string().min(8),
    pincode: z.string().min(6),
    city: z.string().min(2),
    district: z.string().min(2),
    state: z.string().min(2),
    email: z.string().email(),
    alternative_email: z.string().email().nullable().optional(),
    mobile_no: z.string().min(10).max(15),
    alternative_mobile_no: z.string().min(10).max(15).nullable().optional(),
  }),
  academic_details: z.array(academicRecordSchema).min(2),
  documents: z.array(admissionDocumentSchema).min(4),
  privacy_accepted: z.literal(true),
});

export const admissionUpdatePayloadSchema = admissionPayloadSchema.extend({
  id: z.string().uuid(),
});

export const admissionStatusUpdateSchema = z.object({
  admission_id: z.string().uuid(),
  status: z.enum(admissionStatusValues).optional(),
  status_reason: z.string().max(400).nullable().optional(),
  admin_notes: z.string().max(2000).nullable().optional(),
  semester_fee_paid: z.number().nonnegative().nullable().optional(),
  semester_fee_due: z.number().nonnegative().nullable().optional(),
  semester_fees: z
    .array(
      z.object({
        semester: z.string().min(1),
        paid: z.number().nonnegative(),
        due: z.number().nonnegative(),
        updated_at: z.string().datetime().optional().nullable(),
      }),
    )
    .optional(),
  associate_discount_amount: z.number().nonnegative().nullable().optional(),
  associate_discount_note: z.string().max(500).nullable().optional(),
});

export const admissionNoticeSchema = z.object({
  admission_id: z.string().uuid(),
  notice_type: z.enum(["notice", "datesheet"]),
  title: z.string().min(3).max(180),
  description: z.string().min(6).max(5000),
  file_url: z.string().url().nullable().optional(),
  visible_to_student: z.boolean().default(true),
  visible_to_associate: z.boolean().default(true),
});

export const admissionLogFetchSchema = z.object({
  admission_id: z.string().uuid(),
});
