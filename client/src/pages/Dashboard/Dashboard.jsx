import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout.jsx";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import TaskCard from "../../components/TaskCard/TaskCard.jsx";
import TaskForm from "../../components/TaskForm/TaskForm.jsx";
import Modal from "../../components/Modal.jsx";
import Spinner from "../../components/Loader/Spinner.jsx";
import { useAuth } from "../../hooks/useAuth";
import * as taskService from "../../services/taskService";

const DEFAULT_FILTERS = { search: "", status: "", priority: "", sortBy: "createdAt", order: "desc" };

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setStatus((s) => (s === "ready" ? "ready" : "loading"));
    try {
      const cleanParams = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { tasks: fetched, stats: fetchedStats } = await taskService.getTasks(cleanParams);
      setTasks(fetched);
      setStats(fetchedStats);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250); // light debounce for the search field
    return () => clearTimeout(t);
  }, [load]);

  const handleCreate = async (payload) => {
    const created = await taskService.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    setShowCreate(false);
    toast.success("Task created");
    load();
  };

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    try {
      await taskService.updateTaskStatus(task.id, nextStatus);
      load();
    } catch {
      toast.error("Couldn't update that task");
      load();
    }
  };

  const handleDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await taskService.deleteTask(task.id);
      toast.success("Task deleted");
      load();
    } catch {
      toast.error("Couldn't delete that task");
      load();
    }
  };

  return (
    <Layout title={`Welcome, ${user?.name?.split(" ")[0] ?? ""}`} subtitle="Here's what's on your plate.">
      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} accentClass="text-medium" />
        <StatCard label="Completed" value={stats.completed} accentClass="text-accent" />
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar filters={filters} onChange={setFilters} />
        <button
          onClick={() => setShowCreate(true)}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          <PlusIcon className="h-4 w-4" />
          New task
        </button>
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      )}

      {status === "error" && (
        <div className="rounded-card border border-line bg-card p-10 text-center">
          <p className="font-display text-lg text-ink">Couldn't load your tasks</p>
          <p className="mt-1 text-sm text-muted">Check that the API server is running, then try again.</p>
          <button onClick={load} className="mt-4 rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-paper">
            Retry
          </button>
        </div>
      )}

      {status === "ready" && tasks.length === 0 && (
        <div className="rounded-card border border-dashed border-line bg-card p-12 text-center">
          <p className="font-display text-lg text-ink">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted">
            {filters.search || filters.status || filters.priority
              ? "No tasks match those filters."
              : "Add your first task to start your catalog."}
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            New task
          </button>
        </div>
      )}

      {status === "ready" && tasks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggleStatus={handleToggleStatus} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New task" onClose={() => setShowCreate(false)}>
          <TaskForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Create task" />
        </Modal>
      )}
    </Layout>
  );
}

function StatCard({ label, value, accentClass = "text-ink" }) {
  return (
    <div className="rounded-card border border-line bg-card p-4 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${accentClass}`}>{value}</p>
    </div>
  );
}

function PlusIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
    </svg>
  );
}
