"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import AddTaskModal from "./AddTaskModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectDetailClient({
  projectId,
  groupedTasks,
  members,
  projectName,
  ownerEmail,
}: {
  projectId: string;
  groupedTasks: Record<string, any[]>;
  members: { id: string; email: string }[];
  projectName: string;
  ownerEmail: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  // Local state for kanban drag
  const [localTasks, setLocalTasks] = useState(groupedTasks);
  // Handler untuk hapus task
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Yakin ingin menghapus task ini?")) return;
    setDeleteLoadingId(taskId);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus task");
      router.refresh();
    } catch {
      // handle error
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Handler untuk buka modal edit
  const openEditModal = (task: any) => {
    setEditTask(task);
    setEditModalOpen(true);
  };

  // Handler untuk submit edit
  const handleEditTask = async (data: { title: string; description: string; status: string; assigneeId: string }) => {
    if (!editTask) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${editTask.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal update task");
      setEditModalOpen(false);
      setEditTask(null);
      router.refresh();
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const handleAddTask = async (data: { title: string; description: string; status: string; assigneeId: string }) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal menambah task");
      setModalOpen(false);
      router.refresh();
    } catch {
      // handle error (bisa tambahkan notifikasi)
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop handler
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Find the task
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;
    const task = localTasks[sourceCol].find((t: any) => t.id === draggableId);
    if (!task) return;

    // Remove from source
    const newSource = Array.from(localTasks[sourceCol]);
    newSource.splice(source.index, 1);
    // Insert to dest
    const newDest = Array.from(localTasks[destCol] || []);
    const updatedTask = { ...task, status: destCol };
    newDest.splice(destination.index, 0, updatedTask);

    const newTasks = {
      ...localTasks,
      [sourceCol]: newSource,
      [destCol]: newDest,
    };
    setLocalTasks(newTasks);

    // Update backend
    try {
      await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: destCol,
          assigneeId: task.assigneeId || task.assignee?.id || null,
        }),
      });
      // Optionally refresh data from server
      // router.refresh();
    } catch {
      // handle error (bisa tampilkan notifikasi)
    }
  };

  // Sync localTasks with groupedTasks if groupedTasks berubah (misal setelah add/edit/delete)
  React.useEffect(() => {
    setLocalTasks(groupedTasks);
  }, [groupedTasks]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{projectName}</h1>
          <p className="text-gray-500 text-sm">Owner: {ownerEmail}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm font-semibold"
          >
            + Tambah Task
          </button>
          <Link href={`/projects/${projectId}/settings`} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-sm font-semibold">Settings</Link>
        </div>
      </header>


      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTask}
        members={members}
        loading={loading}
        title="Tambah Task Baru"
      />

      {/* Modal Edit Task (reuse AddTaskModal) */}
      <AddTaskModal
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditTask(null); }}
        onSubmit={handleEditTask}
        members={members}
        loading={loading}
        // @ts-ignore
        initialData={editTask}
        title="Edit Task"
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { key: "todo", label: "To Do", color: "border-yellow-400" },
            { key: "inProgress", label: "In Progress", color: "border-blue-400" },
            { key: "done", label: "Done", color: "border-green-400" },
          ].map(col => (
            <Droppable droppableId={col.key} key={col.key}>
              {(provided, snapshot) => (
                <section
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`bg-white rounded-lg shadow p-4 border-t-4 ${col.color} min-h-[120px]`}
                >
                  <h2 className="font-bold text-lg mb-4 text-gray-800">{col.label}</h2>
                  {localTasks[col.key]?.length === 0 ? (
                    <p className="text-gray-400 italic text-sm">Belum ada task.</p>
                  ) : (
                    localTasks[col.key]?.map((task: any, idx: number) => (
                      <Draggable draggableId={task.id} index={idx} key={task.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 rounded border bg-gray-50 shadow-sm flex flex-col gap-1 mb-2"
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.7 : 1,
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                col.key === "todo"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : col.key === "inProgress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {col.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{task.description}</p>
                            {task.assignee && (
                              <p className="text-xs text-gray-500 mt-1">👤 {task.assignee.email}</p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <button
                                className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold"
                                onClick={() => openEditModal(task)}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 font-semibold"
                                onClick={() => handleDeleteTask(task.id)}
                                disabled={deleteLoadingId === task.id}
                              >
                                {deleteLoadingId === task.id ? "Menghapus..." : "Hapus"}
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <section className="mt-10">
        <h2 className="font-semibold text-lg mb-2">Anggota Project</h2>
        <ul className="flex flex-wrap gap-3">
          <li className="px-3 py-1 rounded bg-black text-white text-sm font-semibold">{ownerEmail} <span className="ml-1 text-xs">(Owner)</span></li>
          {members.filter(m => m.email !== ownerEmail).map(m => (
            <li key={m.id} className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm font-semibold">{m.email}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
