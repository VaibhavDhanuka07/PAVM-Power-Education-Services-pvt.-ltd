"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const checklistItems = [
  "I understand my data is used for counselling and admission guidance.",
  "I consent to receive calls, WhatsApp messages, or email updates.",
  "I confirm submitted information is accurate.",
  "I understand I can request correction/removal where applicable.",
];

export function PrivacyChecklistForm() {
  const [checked, setChecked] = useState<boolean[]>(checklistItems.map(() => false));
  const [submitted, setSubmitted] = useState(false);

  const allChecked = useMemo(() => checked.every(Boolean), [checked]);

  function toggle(index: number) {
    setChecked((prev) => prev.map((value, idx) => (idx === index ? !value : value)));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!allChecked) return;
    setSubmitted(true);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="inline-flex items-center gap-2 text-xl font-bold text-slate-900">
        <ShieldCheck className="h-5 w-5 text-blue-700" />
        Privacy Acknowledgement Checklist
      </h2>
      <p className="mt-2 text-sm text-slate-600">Please confirm the items below before submitting counselling forms on this platform.</p>

      <div className="mt-4 space-y-3">
        {checklistItems.map((item, index) => (
          <label key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={checked[index]}
              onChange={() => toggle(index)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={!allChecked}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Confirm and Continue
      </button>

      {submitted ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Checklist confirmed. You can proceed with admissions counselling forms.
        </p>
      ) : null}
    </form>
  );
}

