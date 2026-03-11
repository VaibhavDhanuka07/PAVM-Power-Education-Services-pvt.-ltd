"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function PathwayApplyForm({
  pathwayTitle,
  pathwaySlug,
}: {
  pathwayTitle: string;
  pathwaySlug: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const payload = {
        name,
        phone,
        email,
        course_interest: `Career Pathway: ${pathwayTitle} (${pathwaySlug})`,
        message: message || `Interested in ${pathwayTitle}. Please guide me with eligibility, fees, and process.`,
      };

      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("submission failed");

      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Apply for Counselling</h3>
      <p className="text-sm text-slate-600">Get a customised plan for this pathway.</p>

      <Input
        placeholder="Full name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        minLength={2}
      />
      <Input
        placeholder="Phone number"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        required
        minLength={8}
      />
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <Textarea
        placeholder="Any specific question?"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={4}
      />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Submit Request
      </button>

      {status === "success" ? (
        <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Request submitted. Our counsellor will contact you shortly.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-medium text-rose-700">Submission failed. Please try again.</p>
      ) : null}
    </form>
  );
}

