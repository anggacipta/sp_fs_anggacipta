import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = params.id;
  const { title, description, status, assigneeId } = await req.json();

  // Validasi minimal
  if (!title || !status) {
    return NextResponse.json({ error: "Title dan status wajib diisi" }, { status: 400 });
  }

  // Cek apakah user adalah owner/member project
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      owner: true,
      memberships: { include: { user: true } },
    },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  const allowedUserIds = [project.owner.id, ...project.memberships.map(m => m.user.id)];
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || !allowedUserIds.includes(user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Jika assigneeId diisi, pastikan dia anggota project
  let assignee = null;
  if (assigneeId) {
    assignee = await prisma.user.findUnique({ where: { id: assigneeId } });
    if (!assignee || !allowedUserIds.includes(assignee.id)) {
      return NextResponse.json({ error: "Assignee bukan anggota project" }, { status: 400 });
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status,
      projectId,
      assigneeId: assigneeId || null,
    },
  });

  return NextResponse.json({ task });
}
