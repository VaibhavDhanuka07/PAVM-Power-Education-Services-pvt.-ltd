import { AppRole } from "@/lib/auth/roles";

type AdmissionAccessRow = {
  id: string;
  created_by: string;
  student_user_id: string | null;
  associate_user_id: string | null;
  status: "submitted" | "under_review" | "accepted" | "rejected";
};

export function canAccessAdmission(
  admission: AdmissionAccessRow,
  userId: string,
  role: AppRole,
) {
  if (role === "admin") return true;
  return (
    admission.created_by === userId
    || admission.student_user_id === userId
    || admission.associate_user_id === userId
  );
}

export function canEditAdmission(
  admission: AdmissionAccessRow,
  userId: string,
  role: AppRole,
) {
  if (role === "admin") return true;
  return (
    admission.created_by === userId
    && (admission.status === "submitted" || admission.status === "under_review")
  );
}

