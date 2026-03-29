"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

const starterPrompts = [
  "Upcoming events",
  "How to join the team?",
  "Workshop info",
  "Contact details"
];

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    text:
      "Hi, I am the CGC campus assistant. Ask me about events, workshops, team roles, resources, or how to reach the campus body."
  }
];

const buildReply = (input: string) => {
  const message = input.toLowerCase();

  if (message.includes("event") || message.includes("upcoming") || message.includes("session")) {
    return "You can check the Events page for the latest schedule, venue details, and registration links. If you want, I can also guide you to workshops or announcements.";
  }

  if (message.includes("workshop") || message.includes("bootcamp") || message.includes("training")) {
    return "Workshops usually include hands-on coding sessions, problem-solving practice, and peer learning. Open the Workshops page to see current tracks, levels, and dates.";
  }

  if (
    message.includes("join") ||
    message.includes("apply") ||
    message.includes("member") ||
    message.includes("recruit")
  ) {
    return "To join the campus team, share your interest through the contact form and mention your strengths like coding, design, PR, management, or social media. The leadership team can guide you on openings and next steps.";
  }

  if (
    message.includes("contact") ||
    message.includes("email") ||
    message.includes("linkedin") ||
    message.includes("instagram")
  ) {
    return "You can reach the campus body at gfg.cgcu.campusbody@gmail.com. Social links are also listed on this page: LinkedIn and Instagram are the fastest way to catch updates.";
  }

  if (
    message.includes("team") ||
    message.includes("leader") ||
    message.includes("mentor") ||
    message.includes("role")
  ) {
    return "The Team page highlights campus leads and contributors. If you are trying to find a specific domain like Technical, PR, Design, or Management, the contact form is a good handoff point too.";
  }

  if (
    message.includes("resource") ||
    message.includes("notes") ||
    message.includes("practice") ||
    message.includes("learn")
  ) {
    return "You can explore curated resources on the Resources page for practice material, learning links, and community-recommended references.";
  }

  if (message.includes("hello") || message.includes("hi") || message.includes("hey")) {
    return "Hello! You can ask about events, workshops, team roles, resources, or how to get in touch with the campus body.";
  }

  return "I can help with events, workshops, team details, resources, and contact info. Try asking something like 'upcoming events' or 'how to join the team?'.";
};

export default function CampusChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const nextId = useRef(initialMessages.length + 1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages, isTyping, open]);

  const submitMessage = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: "user",
      text
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setOpen(true);
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: nextId.current++,
        role: "assistant",
        text: buildReply(text)
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div className="w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-[28px] border border-neon-400/20 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_rgba(11,15,23,0.96)_38%)] shadow-[0_24px_90px_-30px_rgba(34,197,94,0.55)] backdrop-blur-xl">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-neon-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Campus Assistant</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">Ask anything about the community</h3>
                <p className="mt-1 text-xs text-slate-400">Instant help for events, roles, resources, and contact.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:border-neon-400/50 hover:text-white"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="max-h-[22rem] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-neon-500 text-ink-900"
                      : "border border-white/10 bg-white/5 text-slate-100"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-neon-300">
                      <Bot className="h-3.5 w-3.5" />
                      Assistant
                    </div>
                  ) : null}
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                  Typing...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submitMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-neon-400/40 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                submitMessage(draft);
              }}
            >
              <input
                className="input !rounded-full !bg-white/5 !py-3 !text-sm"
                placeholder="Ask about GFG campus updates..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button
                type="submit"
                disabled={!draft.trim() || isTyping}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-neon-500 text-ink-900 transition disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 rounded-full border border-neon-400/25 bg-ink-900/90 px-4 py-3 text-left shadow-[0_16px_50px_-24px_rgba(34,197,94,0.6)] backdrop-blur transition hover:border-neon-400/50"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-neon-500 text-ink-900">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="hidden sm:block">
          <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-neon-300">Chatbot</span>
          <span className="block text-sm text-white">Need quick help?</span>
        </span>
      </button>
    </div>
  );
}
