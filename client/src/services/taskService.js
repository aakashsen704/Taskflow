import api from "./api";

export async function getTasks(params = {}) {
  const { data } = await api.get("/tasks", { params });
  return data.data; // { tasks, stats }
}

export async function getTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data.task;
}

export async function createTask(payload) {
  const { data } = await api.post("/tasks", payload);
  return data.data.task;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.data.task;
}

export async function updateTaskStatus(id, status) {
  const { data } = await api.patch(`/tasks/${id}/status`, { status });
  return data.data.task;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/tasks/${id}`);
  return data.data;
}
