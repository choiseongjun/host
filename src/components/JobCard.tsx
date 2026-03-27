import Link from "next/link";
import type { Job } from "@/data/mock";

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="group rounded-xl border border-card-border bg-card-bg p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
              job.type === "구인"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {job.type}
          </span>
          {job.isUrgent && (
            <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
              급구
            </span>
          )}
          {job.isPremium && (
            <span className="rounded bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
              Premium
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted">{job.date}</span>
      </div>

      <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-accent">
        {job.title}
      </h3>

      <p className="mt-1 text-xs text-muted">
        {job.author} · {job.region} {job.district}
      </p>

      <p className="mt-3 line-clamp-2 text-xs leading-5 text-foreground/60">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.requirements.slice(0, 3).map((req) => (
          <span
            key={req}
            className="rounded-full border border-card-border px-2 py-0.5 text-[10px] text-muted"
          >
            {req}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-card-border pt-4">
        <div>
          <p className="text-sm font-medium text-accent">{job.salary}</p>
          <p className="mt-0.5 text-[10px] text-muted">{job.workHours}</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-card-border px-3 py-1 text-[10px] text-muted">
            {job.category}
          </span>
          <span className="rounded-full border border-card-border px-3 py-1 text-[10px] text-muted">
            {job.gender}
          </span>
        </div>
      </div>
    </div>
  );
}
