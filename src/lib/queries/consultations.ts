import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { ConsultationLead } from "@/lib/types";

const mockLeads: ConsultationLead[] = [
  {
    id: "cl1",
    name: "Ritika Sharma",
    phone: "+91 9876543210",
    email: "ritika@example.com",
    course_interest: "B.Tech Computer Science",
    message: "Looking for regular + online options",
    created_at: new Date().toISOString(),
  },
];

export async function getConsultationLeads(): Promise<ConsultationLead[]> {
  if (!isSupabaseConfigured()) return mockLeads;

  const supabase = createClient();
  const { data } = await supabase.from("consultations").select("*").limit(100);

  return data ?? [];
}

