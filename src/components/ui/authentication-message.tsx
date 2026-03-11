import { ShieldCheck } from "lucide-react";

export function AuthenticationMessage({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800 ${className}`}>
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        Secure and authenticated submission: your details are protected, reviewed, and used only for counselling or feedback processing.
      </p>
    </div>
  );
}

