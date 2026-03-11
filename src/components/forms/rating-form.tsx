"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AuthenticationMessage } from "@/components/ui/authentication-message";

const schema = z.object({
  course_id: z.string().min(1),
  rating: z.number().min(1).max(5),
  review: z.string().min(5),
  user_name: z.string().min(2),
  verified_student_id: z.string().min(6),
  sentiment_tags: z.array(z.string()).min(1).max(4),
});

type Values = z.infer<typeof schema>;

export function RatingForm({
  courses,
}: {
  courses: { id: string; name: string }[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      sentiment_tags: [],
    },
  });

  async function onSubmit(values: Values) {
    setError(null);
    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (res.ok) {
      setSubmitted(true);
      reset();
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Unable to submit review. Please try again.");
    }
  }

  return (
    <form className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p className="text-lg font-semibold text-slate-900">Write a Review</p>
        <p className="text-sm text-slate-600">Share your learning experience to help future students choose better.</p>
      </div>

      <Select className="h-11 rounded-xl" {...register("course_id")}>
        <option value="">Select course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        <Select className="h-11 rounded-xl" {...register("rating", { valueAsNumber: true })}>
          <option value="">Rating</option>
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>{value} Star</option>
          ))}
        </Select>
        <Input className="h-11 rounded-xl" placeholder="Your name" {...register("user_name")} />
      </div>
      <Input className="h-11 rounded-xl" placeholder="Verified Student ID (Example: ENR-2026-001)" {...register("verified_student_id")} />
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">Sentiment Tags</p>
        <div className="flex flex-wrap gap-2">
          {["faculty", "support", "placement", "lms"].map((tag) => (
            <label key={tag} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
              <input type="checkbox" value={tag} {...register("sentiment_tags")} />
              {tag.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
      <Textarea className="min-h-[120px] rounded-xl" placeholder="Write your detailed review (teaching, support, LMS, outcomes)" {...register("review")} />
      <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700">
        <Star className="mr-2 h-4 w-4" />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
      <AuthenticationMessage />
      {submitted && <p className="text-sm font-medium text-emerald-700">Thanks. Verified review submitted with sentiment tags.</p>}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </form>
  );
}

