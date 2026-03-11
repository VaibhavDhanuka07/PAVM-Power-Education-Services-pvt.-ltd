"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AuthenticationMessage } from "@/components/ui/authentication-message";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  course_interest: z.string().min(2),
  message: z.string().min(5),
});

type FormValues = z.infer<typeof schema>;

export function ConsultationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [leadScoreMessage, setLeadScoreMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const response = await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.leadScore) {
        setLeadScoreMessage(
          `Lead priority: ${json.leadScore.grade} (${json.leadScore.score}/100) | Assigned counsellor: ${json.leadScore.assignedCounsellor}`,
        );
      } else {
        setLeadScoreMessage(null);
      }
      setSubmitted(true);
      reset();
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Full name</label>
          <Input placeholder="Enter your full name" className="h-11 rounded-xl" {...register("name")} />
          {errors.name && <p className="mt-1 text-xs text-red-600">Name is required.</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Phone number</label>
          <Input placeholder="Enter phone number" className="h-11 rounded-xl" {...register("phone")} />
          {errors.phone && <p className="mt-1 text-xs text-red-600">Phone is required.</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Email address</label>
        <Input type="email" placeholder="Enter email" className="h-11 rounded-xl" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-600">Valid email is required.</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Course or university interest</label>
        <Input placeholder="Example: Online MBA or Marwadi University" className="h-11 rounded-xl" {...register("course_interest")} />
        {errors.course_interest && <p className="mt-1 text-xs text-red-600">Course interest is required.</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Message</label>
        <Textarea placeholder="Tell us your career goal, budget, and preferred mode" className="min-h-[120px] rounded-xl" {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-red-600">Message is required.</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-blue-600 px-6 hover:bg-blue-700">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Submitting..." : "Request Consultation"}
      </Button>

      <AuthenticationMessage />

      {submitted && (
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Thanks, our counsellor will contact you shortly.
          </p>
          {leadScoreMessage ? (
            <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">{leadScoreMessage}</p>
          ) : null}
        </div>
      )}
    </form>
  );
}
