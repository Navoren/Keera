'use server';

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint({ projectId, data }) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if( !userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const project = await db.project.findUnique({
        where: { id: projectId },
        include: {
            sprints: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if(!project) {
        throw new Error("Project not found");
    }
    if(project.organizationId !== orgId) {
        throw new Error("Unauthorized access to project");
    }

    const sprint = await db.sprint.create({
        data: {
            name: data.name,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            projectId: projectId,
            status: 'PLANNED',
        }
    })

    return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;
    const orgRole = sessionClaims?.o?.rol;

    if( !userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: { id: sprintId },
            include: {
                project: true,
            },
        });

        if( !sprint) {
            throw new Error("Sprint not found");
        }
        if(sprint.project.organizationId !== orgId) {
            throw new Error("Unauthorized access to sprint");
        }
        if(orgRole !== 'admin') {
            throw new Error("Insufficient permissions to update sprint status");
        }

        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
    throw new Error("Cannot start sprint outside of its date range");
    }

    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
    throw new Error("Can only complete an active sprint");
    }
        
    const updatedSprint = await db.sprint.update({
            where: { id: sprintId },
            data: { status: newStatus },
        });

        return { updatedSprint, message: `Sprint status updated to ${newStatus}` };
    } catch (error) {
        console.error("Error updating sprint status:", error.message);
        throw new Error("Failed to update sprint status");
        
    }
}