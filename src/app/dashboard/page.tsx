import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import DashboardPageClient from "./DashboardPageClient"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <p className="text-center mt-10 text-red-500">Unauthorized</p>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: true,
      memberships: { include: { project: true } },
    },
  })

  const ownedProjects = user?.projects || []
  const memberProjects = user?.memberships.map((m: any) => m.project) || []
  const allProjectsMap = new Map()

  ownedProjects.forEach((project: any) => allProjectsMap.set(project.id, project))
  memberProjects.forEach((project: any) => allProjectsMap.set(project.id, project))

  const allProjects = Array.from(allProjectsMap.values())

  return <DashboardPageClient user={user} projects={allProjects} />
}
