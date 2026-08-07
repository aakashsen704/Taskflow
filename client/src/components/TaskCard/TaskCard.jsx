// The visual conceit: each task reads like a library catalog card — a punch
// hole, a dashed stitch border, and a monospace date stamp — because a task
// list is, at its core, a little card catalog of things to do.

import { Link } from "react-router-dom";

const PRIORITY_STYLES = {
  HIGH: { label: "High", text: "text-high", bg: "bg-high-light", dot: "bg-high" },
  MEDIUM: { label: "Medium", text: "text-medium", bg: "bg-medium-light", dot: "bg-medium" },
  LOW: { label: "Low", text: "text-low", bg: "bg-low-light", dot: "bg-low" },
};

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskCard({ task, onToggleStatus, onDelete }) {
  const p = PRIORITY_STYLES[task.priority];
  const isDone = task.status === "COMPLETED";

  return (
    <div className="group relative rounded-card border border-line bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
      <span className="punch-hole absolute left-3 top-3 h-2 w-2" aria-hidden="true" />

      <div className="flex items-start gap-3 pl-4">
        <button
          onClick={() => onToggleStatus(task)}
          aria-label={isDone ? "Mark as pending" : "Mark as complete"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            isDone ? "border-accent bg-accent" : "border-line hover:border-accent"
          }`}
        >
          {isDone && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
              <path d="m2.5 6.2 2.3 2.3 4.7-4.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <Link to={`/tasks/${task.id}`} className="block">
            <h3 className={`truncate font-display text-base font-medium ${isDone ? "text-muted line-through" : "text-ink"}`}>
              {task.title}
            </h3>
          </Link>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${p.bg} ${p.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>
            {task.dueDate && (
              <span className="font-mono text-xs text-muted">Due {formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(task)}
          aria-label="Delete task"
          className="shrink-0 rounded-lg p-1.5 text-muted opacity-0 transition-opacity hover:bg-high-light hover:text-high group-hover:opacity-100"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1l.5-8.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <span className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-muted/70">
        #{String(task.id).padStart(4, "0")}
      </span>
    </div>
  );
}
