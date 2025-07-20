import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await req.json()

  if (!name || name.trim() === "") {
    return NextResponse.json({ message: 'Nama wajib diisi' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 })
  }

  const project = await prisma.project.create({
    data: {
      name,
      owner: { connect: { id: user.id } },
      memberships: {
        create: { userId: user.id }, // otomatis jadi member juga
      },
    },
  })

  return NextResponse.json(project)
}
