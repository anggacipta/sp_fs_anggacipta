'use client'

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

import Link from "next/link"
import TaskAnalyticsChart from "./TaskAnalyticsChart";

export default function DashboardPageClient({ user, projects }: { user: any, projects: any[] }) {
  const [formOpen, setFormOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleCreate = async () => {
    if (!projectName.trim()) return setError("Nama project wajib diisi.")
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName }),
      })

      if (!res.ok) throw new Error("Gagal membuat project.")

      setProjectName("")
      setFormOpen(false)
      router.refresh() // refresh dashboard tanpa reload halaman
    } catch (e) {
      setError("Gagal menyimpan project.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Hi, {user.email || "User"} 👋</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm text-gray-600 border px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </header>


      {/* Task Analytics Chart */}
      <TaskAnalyticsChart />

      {/* Project List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Project Kamu</h2>
        {/* Tombol Export dan Tambah Project */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setFormOpen(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            + Tambah Project
          </button>
          <button
            onClick={() => {
              // Download file JSON dari API
              fetch("/api/projects/export").then(async res => {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "projects-export.json";
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              });
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Export ke JSON
          </button>
        </div>
        {formOpen && (
          <div className="border p-4 rounded bg-white shadow mb-6">
            <h3 className="font-semibold mb-2">Buat Project Baru</h3>
            <input
              type="text"
              placeholder="Nama Project"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="border px-3 py-2 w-full rounded mb-2"
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                onClick={() => { setFormOpen(false); setError("") }}
                className="text-gray-600 px-4 py-2 rounded border hover:bg-gray-100"
              >
                Batal
              </button>
            </div>
          </div>
        )}
        {projects.length === 0 ? (
          <p className="text-gray-600">Kamu belum punya project.</p>
        ) : (
          <ul className="space-y-3">
            {projects.map(project => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block border border-gray-300 p-4 rounded shadow-sm bg-white hover:bg-gray-50 transition focus:ring-2 focus:ring-black outline-none"
                tabIndex={0}
              >
                <div className="font-medium">{project.name}</div>
              </Link>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
