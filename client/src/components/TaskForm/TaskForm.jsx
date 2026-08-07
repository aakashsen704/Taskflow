import { useState } from "react";

const emptyTask = { title: "", description: "", priority: "MEDIUM", status: "PENDING", dueDate: "" };

export default function TaskForm({ initialTask, onSubmit, onCancel, submitLabel = "Create task" }) {
  const [form, setForm] = useState(() => ({
    ...emptyTask,
    ...initialTask,
    dueDate: initialTask?.dueDate ? initialTask.dueDate.slice(0, 10) : "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save the task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Title</label>
        <input
          autoFocus
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="What needs to get done?"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink">Description</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
          placeholder="Any extra detail (optional)"
          className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => update({ priority: e.target.value })}
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink">Due date</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update({ dueDate: e.target.value })}
            className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
      </div>

      {error && <p className="text-sm text-high">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
