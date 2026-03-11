"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AdminBlogForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<string>("");

  async function submit(formData: FormData) {
    const payload = Object.fromEntries(formData.entries());
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(json.error || "Failed to publish");
      return;
    }
    setStatus("Blog published");
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} action={submit} className="space-y-3">
      <Input name="title" placeholder="Blog title" required />
      <Input name="slug" placeholder="slug" required />
      <Input name="image" placeholder="Image URL" />
      <Textarea name="excerpt" placeholder="Short excerpt" required />
      <Textarea name="content" placeholder="Blog content" required className="min-h-[140px]" />
      <Button type="submit" size="sm">Publish Blog</Button>
      {status && <p className="text-xs text-slate-600">{status}</p>}
    </form>
  );
}

