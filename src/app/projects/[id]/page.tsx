import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Link from "next/link"
import ProjectDetailClient from "./ProjectDetailClient";
// import { useState } from "react"
// import { useRouter } from "next/navigation"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    const userEmail = session?.user?.email

    if (!userEmail) return notFound()

    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: {
            tasks: {
                include: {
                    assignee: true,
                },
            },
            owner: true,
            memberships: { include: { user: true } },
        },
    })

    if (!project) return notFound()

    const groupedTasks = {
        todo: project.tasks.filter(t => t.status === "todo"),
        inProgress: project.tasks.filter(t => t.status === "in-progress"),
        done: project.tasks.filter(t => t.status === "done"),
    }

    const owner = project.owner;
    const memberUsers = project.memberships
        .map(m => m.user)
        .filter(u => u.id !== owner.id);


    return (
        <ProjectDetailClient
            projectId={project.id}
            groupedTasks={groupedTasks}
            members={[owner, ...memberUsers]}
            projectName={project.name}
            ownerEmail={owner.email || ""}
        />
    )
}
