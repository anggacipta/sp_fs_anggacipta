import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProjectSettingsClient from "../ProjectSettingsClient";
import { redirect } from "next/navigation";

export default async function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    redirect("/login");
  }
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      memberships: { include: { user: true } },
    },
  });
  if (!project) redirect("/projects");
  if (project.owner.email !== session.user.email) {
    redirect(`/projects/${params.id}`);
  }
  const members = project.memberships.map(m => ({ id: m.user.id, email: m.user.email }));
  return (
    <ProjectSettingsClient
      projectId={project.id}
      ownerEmail={project.owner.email}
      members={members}
      projectName={project.name}
    />
  );
}
