import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout.jsx";
import TaskForm from "../../components/TaskForm/TaskForm.jsx";
import Spinner from "../../components/Loader/Spinner.jsx";
import * as taskService from "../../services/taskService";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    let ignore = false;
    setStatus("loading");
    taskService
      .getTask(id)
      .then((t) => {
        if (!ignore) {
          setTask(t);
          setStatus("ready");
        }
      })
      .catch(() => !ignore && setStatus("error"));
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleUpdate = async (payload) => {
    const updated = await taskService.updateTask(id, payload);
    setTask(updated);
    setEditing(false);
    toast.success("Task updated");
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${task.title}"? This can't be undone.`)) return;
    await taskService.deleteTask(id);
    toast.success("Task deleted");
    navigate("/dashboard");
  };

  return (
    <Layout title="Task details" subtitle="">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        ← Back to dashboard
      </Link>

      {status === "loading" && (
        <div className="flex justify-center py-24">
          <Spinner />
        </div>
      )}

      {status === "error" && (
        <div className="rounded-card border border-line bg-card p-10 text-center">
          <p className="font-display text-lg text-ink">Task not found</p>
          <p className="mt-1 text-sm text-muted">It may have been deleted, or belongs to another account.</p>
        </div>
      )}

      {status === "ready" && task && !editing && (
        <div className="max-w-2xl rounded-card border border-line bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs text-muted">#{String(task.id).padStart(4, "0")}</span>
              <h2 className="mt-1 font-display text-2xl font-semibold text-ink">{task.title}</h2>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                task.status === "COMPLETED" ? "bg-accent-light text-accent-dark" : "bg-medium-light text-medium"
              }`}
            >
              {task.status === "COMPLETED" ? "Completed" : "Pending"}
            </span>
          </div>

          {task.description && <p className="mt-4 text-sm leading-relaxed text-ink/80">{task.description}</p>}

          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Priority</dt>
              <dd className="mt-1 font-medium text-ink">{task.priority}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Due date</dt>
              <dd className="mt-1 font-mono text-ink">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Created</dt>
              <dd className="mt-1 font-mono text-ink">{new Date(task.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">Last updated</dt>
              <dd className="mt-1 font-mono text-ink">{new Date(task.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-2 border-t border-line pt-4">
            <button
              onClick={() => setEditing(true)}
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="rounded-lg border border-high/30 px-4 py-2 text-sm font-medium text-high hover:bg-high-light"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {status === "ready" && task && editing && (
        <div className="max-w-2xl rounded-card border border-line bg-card p-6 shadow-card">
          <TaskForm initialTask={task} onSubmit={handleUpdate} onCancel={() => setEditing(false)} submitLabel="Save changes" />
        </div>
      )}
    </Layout>
  );
}
