import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("BODY:", body)

    const { email, password } = body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    console.log("EXISTING USER:", existingUser)

    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    console.log("USER CREATED:", user)

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("REGISTER ERROR:", error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}


