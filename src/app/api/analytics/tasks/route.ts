import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/analytics/tasks
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Ambil semua project user (owner atau member)
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { owner: { email: session.user.email } },
        { memberships: { some: { user: { email: session.user.email } } } },
      ],
    },
    select: {
      id: true,
      name: true,
      tasks: {
        select: { status: true },
      },
    },
  });
  // Hitung jumlah task per status per project
  const data = projects.map(p => {
    const counts = { todo: 0, inProgress: 0, done: 0 };
    p.tasks.forEach(t => {
      if (t.status === "todo") counts.todo++;
      else if (t.status === "inProgress") counts.inProgress++;
      else if (t.status === "done") counts.done++;
    });
    return {
      id: p.id,
      name: p.name,
      ...counts,
    };
  });
  return NextResponse.json(data);
}
