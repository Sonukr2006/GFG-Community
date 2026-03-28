"use client";

import { formatDate } from "@/lib/utils";
const getImageSrc = (value?: string) => {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  return `${base}${value.startsWith("/") ? "" : "/"}${value}`;
};

export default function EventCard({
  title,
  description,
  date,
  tag,
  link,
  image_url
}: {
  title: string;
  description: string;
  date: string;
  tag?: string;
  link?: string;
  image_url?: string;
}) {
  return (
    <div className="card flex flex-col justify-between">
      {image_url ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
          <img src={getImageSrc(image_url)} alt={title} className="h-40 w-full object-cover" />
        </div>
      ) : null}
      <div>
        {tag ? <span className="badge bg-white/5 text-slate-300">{tag}</span> : null}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
        <span>{formatDate(date)}</span>
        {link ? (
          <a className="text-neon-400" href={link} target="_blank" rel="noreferrer">
            Register →
          </a>
        ) : (
          <span className="text-neon-400">Register →</span>
        )}
      </div>
    </div>
  );
}
