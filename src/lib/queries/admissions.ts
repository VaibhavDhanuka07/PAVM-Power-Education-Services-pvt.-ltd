import { AdmissionNotice, AdmissionRecord, AdmissionStatusLog } from "@/lib/types";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function getAdmissionsForCurrentUser(): Promise<AdmissionRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();

  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return [];

  const { data } = await supabase
    .from("admissions")
    .select("*")
    .or(`created_by.eq.${authData.user.id},student_user_id.eq.${authData.user.id},associate_user_id.eq.${authData.user.id}`)
    .order("created_at", { ascending: false });

  return (data ?? []) as AdmissionRecord[];
}

export async function getAllAdmissionsForAdmin(): Promise<AdmissionRecord[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();

  const { data } = await supabase
    .from("admissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as AdmissionRecord[];
}

export async function getAdmissionLogs(admissionId: string): Promise<AdmissionStatusLog[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("admission_status_logs")
    .select("*")
    .eq("admission_id", admissionId)
    .order("updated_at", { ascending: false });

  return (data ?? []) as AdmissionStatusLog[];
}

export async function getAdmissionNotices(admissionId: string): Promise<AdmissionNotice[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("admission_notices")
    .select("*")
    .eq("admission_id", admissionId)
    .order("created_at", { ascending: false });

  return (data ?? []) as AdmissionNotice[];
}
