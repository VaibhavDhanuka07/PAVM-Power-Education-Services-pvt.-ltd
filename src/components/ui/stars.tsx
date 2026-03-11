import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function Stars({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value);
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            "h-4 w-4",
            index < rounded ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-slate-300",
          )}
        />
      ))}
    </div>
  );
}


