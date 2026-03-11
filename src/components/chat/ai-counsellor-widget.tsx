"use client";

import { useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  "Which online MBA is best for working professionals?",
  "Show low-fee distance courses.",
  "Suggest vocational programs after 12th.",
];

export function AiCounsellorWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello, I am your AI Counsellor. I can help you choose the right course, compare universities, and understand fees, duration, and admission process.",
    },
  ]);
  const endRef = useRef<HTMLDivElement | null>(null);

  const trimmed = useMemo(() => input.trim(), [input]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-counsellor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history: messages.slice(-8) }),
      });
      const json = (await response.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            json.reply ||
            "I can help with admissions, fees, eligibility, and university/course comparison. Please ask your question again.",
        },
      ]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not process that request right now. Please try again, or use Free Counselling for direct support.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {open ? (
        <div className="fixed bottom-4 left-3 right-3 z-50 rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur sm:bottom-5 sm:left-5 sm:right-auto sm:w-[22rem]">
          <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-white">
            <div className="inline-flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-semibold">AI Admission Counsellor</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-white/90 transition hover:bg-white/20 hover:text-white"
              aria-label="Close AI counsellor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-3 text-sm custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-xl px-3 py-2 ${
                  message.role === "user"
                    ? "ml-10 bg-blue-600 text-white"
                    : "mr-6 border border-slate-200 bg-slate-50 text-slate-800"
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading ? (
              <div className="mr-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            ) : null}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask(prompt)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                void ask(trimmed);
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about courses, fees, admissions..."
                className="h-10 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!trimmed || loading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 left-3 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-xl shadow-blue-600/30 transition hover:brightness-105 sm:bottom-5 sm:left-5 sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Ask AI Counsellor</span>
          <span className="sm:hidden">Ask AI</span>
        </button>
      )}
    </>
  );
}
