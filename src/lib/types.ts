export type EducationMode = {
  id: string;
  name: string;
};

export type CourseSector = {
  id: string;
  name: string;
  slug: string;
};

export type University = {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  mode_supported: string[];
  logo: string | null;
};

export type Course = {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  sector_id: string;
  mode_id: string;
  sector?: CourseSector;
  mode?: EducationMode;
};

export type UniversityCourse = {
  id: string;
  university_id: string;
  course_id: string;
  fees: number;
  duration: string;
  university?: University;
  course?: Course;
};

export type Rating = {
  id: string;
  course_id: string;
  rating: number;
  review_count: number;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string | null;
};

export type ConsultationLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  course_interest: string;
  message: string;
  created_at?: string;
};

export type CareerCombo = {
  id: string;
  title: string;
  slug: string;
  coaching_program: string;
  degree_program: string;
  description: string;
  duration: string;
  price: string;
  highlight_tag: string;
};

export type CourseListing = {
  course: Course;
  min_fees: number;
  university_count: number;
  university_names?: string[];
  student_count: number;
  average_rating: number;
  review_count: number;
  levels?: Array<{
    label: string;
    duration: string;
    fees: number;
    slug: string;
  }>;
};

export type UniversityListing = {
  university: University;
  course_count: number;
  student_count: number;
  average_rating: number;
};

export type AdmissionStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

export type AdmissionCourseType =
  | "diploma"
  | "pg_diploma"
  | "ug_course"
  | "pg_course"
  | "vocational_course"
  | "skill_course";

export type AdmissionProgramMode = "regular" | "online" | "distance";

export type AdmissionType = "new" | "lateral_entry";

export type AdmissionLevel =
  | "one_year_diploma"
  | "two_year_advanced_diploma"
  | "three_year_bachelors_degree"
  | "six_month_certification"
  | "eleven_month_diploma";

export type AdmissionAcademicRecord = {
  qualification:
    | "tenth"
    | "twelfth"
    | "diploma"
    | "graduation"
    | "pg_diploma";
  board_or_university: string;
  year_of_passing: string;
  percentage_or_cgpa: string;
  result: "pass" | "fail";
};

export type AdmissionSemesterFee = {
  semester: string;
  paid: number;
  due: number;
  updated_at?: string | null;
};

export type AdmissionDocument = {
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
  file_name: string;
  mime_type: string;
  size_bytes: number;
  data_url: string;
};

export type AdmissionBasicDetails = {
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
  deb_id: string | null;
};

export type AdmissionPersonalDetails = {
  address: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  email: string;
  alternative_email: string | null;
  mobile_no: string;
  alternative_mobile_no: string | null;
};

export type AdmissionRecord = {
  id: string;
  created_by: string;
  created_by_role: "associate" | "student" | "user";
  student_user_id: string | null;
  associate_user_id: string | null;
  admission_session: string;
  admission_type: AdmissionType;
  course_type: AdmissionCourseType;
  program_mode: AdmissionProgramMode;
  admission_level: AdmissionLevel | null;
  course_name: string;
  stream_name: string;
  admission_semester: string;
  basic_details: AdmissionBasicDetails;
  personal_details: AdmissionPersonalDetails;
  academic_details: AdmissionAcademicRecord[];
  documents: AdmissionDocument[];
  privacy_accepted: boolean;
  status: AdmissionStatus;
  status_reason: string | null;
  admin_notes: string | null;
  associate_discount_amount: number | null;
  associate_discount_note: string | null;
  associate_discount_updated_at: string | null;
  semester_fee_paid: number | null;
  semester_fee_due: number | null;
  fee_updated_at: string | null;
  semester_fees: AdmissionSemesterFee[];
  status_updated_at: string;
  created_at: string;
  updated_at: string;
  creator_profile?: {
    id: string;
    email: string;
    full_name: string | null;
    role: "admin" | "associate" | "student" | "user";
  } | null;
};

export type AdmissionStatusLog = {
  id: string;
  admission_id: string;
  status: AdmissionStatus;
  note: string | null;
  updated_by: string | null;
  updated_at: string;
};

export type AdmissionNotice = {
  id: string;
  admission_id: string;
  notice_type: "notice" | "datesheet";
  title: string;
  description: string;
  file_url: string | null;
  created_by: string;
  visible_to_student: boolean;
  visible_to_associate: boolean;
  created_at: string;
};

