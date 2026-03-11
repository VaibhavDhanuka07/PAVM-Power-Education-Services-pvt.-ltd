"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AdminUniversityForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string>("");

  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/admin/universities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed to add university");
      return;
    }
    setStatus("University added");
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} action={submit} className="space-y-3">
      <Input name="name" placeholder="University name" required />
      <Input name="slug" placeholder="slug" required />
      <Input name="location" placeholder="Location" required />
      <Input name="mode_supported" placeholder="Modes (comma separated)" required />
      <Input name="logo" placeholder="Logo URL" />
      <Textarea name="description" placeholder="Description" required />
      <Button type="submit" size="sm">Add University</Button>
      {status && <p className="text-xs text-slate-600">{status}</p>}
    </form>
  );
}

