import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient as createServerSupabase, isSupabaseConfigured } from "@/lib/supabase/server";

const aggregateSchema = z.object({
  course_id: z.string().min(1),
  rating: z.number().min(1).max(5),
  review_count: z.number().int().min(10).max(500),
});

const reviewSchema = z.object({
  course_id: z.string().min(1),
  rating: z.number().min(1).max(5),
  review: z.string().min(5),
  user_name: z.string().min(2),
  verified_student_id: z.string().regex(/^ENR[-/A-Z0-9]{4,}$/i, "Verified student ID is required"),
  sentiment_tags: z.array(z.enum(["faculty", "support", "placement", "lms"])).min(1).max(4),
});

export async function POST(req: Request) {
  const payload = await req.json();
  const aggregateParsed = aggregateSchema.safeParse(payload);
  const reviewParsed = reviewSchema.safeParse(payload);

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, mock: true });
  }

  const supabase = createServerSupabase();

  if (reviewParsed.success) {
    const { course_id, rating, review, user_name, verified_student_id, sentiment_tags } = reviewParsed.data;

    const { data: existing, error: fetchError } = await supabase
      .from("ratings")
      .select("course_id, rating, review_count")
      .eq("course_id", course_id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    const currentCount = existing?.review_count ?? 0;
    const currentRating = existing?.rating ?? 0;
    const nextCount = currentCount + 1;
    const nextRating = Number(((currentRating * currentCount + rating) / nextCount).toFixed(1));

    const { error: upsertError } = await supabase
      .from("ratings")
      .upsert({ course_id, rating: nextRating, review_count: nextCount }, { onConflict: "course_id" });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Optional detail logging table for verified reviews; ignore safely if table not present.
    const { error: reviewInsertError } = await supabase.from("course_reviews").insert({
      course_id,
      user_name,
      review,
      rating,
      verified_student_id,
      sentiment_tags,
      is_verified: true,
    });

    if (reviewInsertError && !reviewInsertError.message.toLowerCase().includes("does not exist")) {
      return NextResponse.json({ error: reviewInsertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  if (!aggregateParsed.success) {
    return NextResponse.json({ error: "Invalid rating payload" }, { status: 400 });
  }

  const { error } = await supabase.from("ratings").upsert(aggregateParsed.data, { onConflict: "course_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

