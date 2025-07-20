// Update project name (PATCH)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = params.id;
  const { name } = await req.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Nama project wajib diisi" }, { status: 400 });
  }
  // Cek project dan owner
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { owner: true },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Hanya owner yang bisa edit project" }, { status: 403 });
  }
  await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });
  return NextResponse.json({ success: true });
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Invite member (POST)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = params.id;
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });

  // Cek project dan owner
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { owner: true, memberships: { include: { user: true } } },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Hanya owner yang bisa invite member" }, { status: 403 });
  }

  // Cek user yang di-invite
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  if (user.id === project.owner.id) {
    return NextResponse.json({ error: "Owner tidak perlu di-invite" }, { status: 400 });
  }
  const alreadyMember = project.memberships.some(m => m.user.id === user.id);
  if (alreadyMember) {
    return NextResponse.json({ error: "User sudah menjadi member" }, { status: 400 });
  }

  // Tambahkan ke membership
  await prisma.membership.create({
    data: {
      userId: user.id,
      projectId,
    },
  });
  return NextResponse.json({ success: true });
}

// Delete project (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const projectId = params.id;
  // Cek project dan owner
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { owner: true },
  });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.owner.email !== session.user.email) {
    return NextResponse.json({ error: "Hanya owner yang bisa menghapus project" }, { status: 403 });
  }
  // Hapus semua task dan membership sebelum hapus project (manual cascade)
  await prisma.task.deleteMany({ where: { projectId } });
  await prisma.membership.deleteMany({ where: { projectId } });
  await prisma.project.delete({ where: { id: projectId } });
  return NextResponse.json({ success: true });
}
