export default function SearchBar({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          placeholder="Search tasks by title or description…"
          className="w-full rounded-lg border border-line bg-paper py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => update({ status: e.target.value })}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      >
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="COMPLETED">Completed</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => update({ priority: e.target.value })}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      >
        <option value="">All priorities</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <select
        value={`${filters.sortBy}:${filters.order}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split(":");
          update({ sortBy, order });
        }}
        className="rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="dueDate:asc">Due date ↑</option>
        <option value="dueDate:desc">Due date ↓</option>
        <option value="priority:desc">Priority</option>
        <option value="title:asc">Title A–Z</option>
      </select>
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="m17 17-4-4" strokeLinecap="round" />
    </svg>
  );
}
