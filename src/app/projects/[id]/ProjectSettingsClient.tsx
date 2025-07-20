"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamic import agar tidak SSR error (karena react-select butuh window)
const InviteMemberSelect = dynamic(() => import("./InviteMemberSelect"), { ssr: false });

export default function ProjectSettingsClient({
  projectId,
  ownerEmail,
  members,
  projectName: initialProjectName,
}: {
  projectId: string;
  ownerEmail: string;
  members: { id: string; email: string }[];
  projectName: string;
}) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initialProjectName);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  const router = useRouter();

  const handleEdit = async () => {
    if (!name.trim()) return setEditError("Nama project wajib diisi.");
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Gagal update nama project");
      setEditSuccess(true);
      setEditing(false);
      // router.refresh(); // opsional jika ingin reload data
    } catch (err: any) {
      setEditError(err.message || "Gagal update nama project");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus project ini? Semua data akan hilang.")) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus project");
      router.push("/dashboard");
    } catch (err: any) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white rounded shadow p-6">
      <button
        onClick={() => router.push(`/projects/${projectId}`)}
        className="mb-4 text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100 transition"
      >
        ← Kembali ke Project
      </button>
      <h1 className="text-2xl font-bold mb-6">Project Settings</h1>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Edit Nama Project</h2>
        {editing ? (
          <div className="flex gap-2 items-center mb-2">
            <input
              className="border px-3 py-2 rounded w-2/3"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={editLoading}
            />
            <button
              onClick={handleEdit}
              disabled={editLoading}
              className="bg-black text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800"
            >
              {editLoading ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              onClick={() => { setEditing(false); setName(initialProjectName); setEditError(null); setEditSuccess(false); }}
              disabled={editLoading}
              className="text-gray-600 px-4 py-2 rounded border text-sm hover:bg-gray-100"
            >
              Batal
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg">{name}</span>
            <button
              onClick={() => { setEditing(true); setEditError(null); setEditSuccess(false); }}
              className="text-xs text-gray-500 border px-2 py-1 rounded hover:bg-gray-100"
            >
              Edit
            </button>
          </div>
        )}
        {editError && <div className="text-red-500 text-xs mb-2">{editError}</div>}
        {editSuccess && <div className="text-green-600 text-xs mb-2">Nama project berhasil diupdate!</div>}
      </section>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Invite Member</h2>
        <InviteMemberSelect projectId={projectId} />
      </section>
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Anggota Project</h2>
        <ul className="flex flex-wrap gap-2">
          <li className="px-3 py-1 rounded bg-black text-white text-sm font-semibold">{ownerEmail} <span className="ml-1 text-xs">(Owner)</span></li>
          {members.filter(m => m.email !== ownerEmail).map(m => (
            <li key={m.id} className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-semibold">{m.email}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-semibold mb-2 text-red-700">Danger Zone</h2>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-red-700 disabled:opacity-60"
          disabled={deleteLoading}
        >
          {deleteLoading ? "Menghapus..." : "Delete Project"}
        </button>
        {deleteError && <p className="text-red-600 text-sm mt-2">{deleteError}</p>}
      </section>
    </div>
  );
}
