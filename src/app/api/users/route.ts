import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/users?query=xxx
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  // Cari user by email, exclude self
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: query,
        mode: "insensitive",
      },
      NOT: { email: session.user.email },
    },
    select: { id: true, email: true },
    take: 10,
  });
  return NextResponse.json(users);
}
