"use client";

import { useState } from "react";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; status: string; assigneeId: string }) => void;
  members: { id: string; email: string }[];
  loading?: boolean;
  initialData?: {
    title?: string;
    description?: string;
    status?: string;
    assigneeId?: string;
  };
  title?: string;
}

import { useEffect } from "react";

export default function AddTaskModal({ open, onClose, onSubmit, members, loading, initialData, title: modalTitle }: AddTaskModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "todo");
  const [assigneeId, setAssigneeId] = useState(initialData?.assigneeId || "");
  const [error, setError] = useState("");

  // Reset value saat initialData berubah (untuk edit)
  useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setStatus(initialData?.status || "todo");
    setAssigneeId(initialData?.assigneeId || "");
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return setError("Judul wajib diisi.");
    setError("");
    onSubmit({ title, description, status, assigneeId });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900">{modalTitle || (initialData ? "Edit Task" : "Tambah Task Baru")}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Judul</label>
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi</label>
            <textarea
              className="border px-3 py-2 rounded w-full"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <select
              className="border px-3 py-2 rounded w-full"
              value={assigneeId}
              onChange={e => setAssigneeId(e.target.value)}
            >
              <option value="">(Tidak ada)</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.email}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-black text-white font-semibold hover:bg-gray-800"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
