"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AdminAssignmentForm({
  universities,
  courses,
}: {
  universities: { id: string; name: string }[];
  courses: { id: string; name: string; duration: string }[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string>("");

  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed to assign");
      return;
    }
    setStatus("Course assigned");
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} action={submit} className="space-y-3">
      <Select name="university_id" required>
        <option value="">Select university</option>
        {universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
      </Select>
      <Select name="course_id" required>
        <option value="">Select course</option>
        {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
      </Select>
      <Input name="fees" type="number" min="0" placeholder="Fees" required />
      <Input name="duration" placeholder="Duration" required />
      <Button type="submit" size="sm">Assign Course</Button>
      {status && <p className="text-xs text-slate-600">{status}</p>}
    </form>
  );
}

