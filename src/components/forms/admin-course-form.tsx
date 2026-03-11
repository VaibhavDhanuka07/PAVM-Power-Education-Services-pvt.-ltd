"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AdminCourseForm({
  sectors,
  modes,
}: {
  sectors: { id: string; name: string }[];
  modes: { id: string; name: string }[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string>("");

  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed to add course");
      return;
    }
    setStatus("Course added");
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} action={submit} className="space-y-3">
      <Input name="name" placeholder="Course name" required />
      <Input name="slug" placeholder="slug" required />
      <Input name="duration" placeholder="Duration" required />
      <Select name="sector_id" required>
        <option value="">Select sector</option>
        {sectors.map((sector) => <option key={sector.id} value={sector.id}>{sector.name}</option>)}
      </Select>
      <Select name="mode_id" required>
        <option value="">Select mode</option>
        {modes.map((mode) => <option key={mode.id} value={mode.id}>{mode.name}</option>)}
      </Select>
      <Textarea name="description" placeholder="Description" required />
      <Button type="submit" size="sm">Add Course</Button>
      {status && <p className="text-xs text-slate-600">{status}</p>}
    </form>
  );
}

