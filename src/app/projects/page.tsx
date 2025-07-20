import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return <p className="text-center mt-10 text-red-500">Unauthorized</p>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: true, // sebagai owner
      memberships: { include: { project: true } }, // sebagai member
    },
  })

  const ownedProjects = user?.projects.map(p => ({ ...p, role: 'Owner' })) || []
  const memberProjects = user?.memberships.map(m => ({ ...m.project, role: 'Member' })) || []
  const allProjects = [...ownedProjects, ...memberProjects]

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Semua Projects</h1>

      {allProjects.length === 0 ? (
        <p className="text-gray-600">Belum ada project yang kamu ikuti.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-b">Nama Project</th>
                <th className="px-4 py-2 text-left border-b">Peran</th>
                <th className="px-4 py-2 text-left border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{project.name}</td>
                  <td className="px-4 py-2 border-b">{project.role}</td>
                  <td className="px-4 py-2 border-b">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Lihat Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
