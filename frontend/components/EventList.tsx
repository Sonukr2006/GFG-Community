"use client";

import { useMemo, useState } from "react";
import EventCard from "@/components/EventCard";

export type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  tag?: string;
  link?: string;
  image_url?: string;
  status: "upcoming" | "past";
};

export default function EventList({ events }: { events: EventItem[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "all" ? true : event.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [events, query, filter]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="input md:max-w-sm"
          placeholder="Search events"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="flex gap-3 text-xs font-semibold uppercase tracking-widest">
          {(["all", "upcoming", "past"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 ${
                filter === value ? "bg-neon-500 text-ink-900" : "border border-white/10 text-slate-300"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {filtered.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}
