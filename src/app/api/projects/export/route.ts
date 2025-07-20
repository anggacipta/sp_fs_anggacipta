import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/projects/export
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Ambil semua project user (owner/member) beserta tasks dan anggota
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { owner: { email: session.user.email } },
        { memberships: { some: { user: { email: session.user.email } } } },
      ],
    },
    include: {
      owner: { select: { id: true, email: true } },
      memberships: { include: { user: { select: { id: true, email: true } } } },
      tasks: true,
    },
  });
  return new Response(JSON.stringify(projects, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=projects-export.json",
    },
  });
}
