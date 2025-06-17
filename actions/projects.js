'use server';
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;
    
    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const {data: membershipList} = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const userMemebership = membershipList.find(
        (member) => member.publicUserData.userId === userId
    );

    if( !userMemebership || userMemebership.role !== 'org:admin') {
        throw new Error("User is not a member of the organization and only organization admins can create projects");
    }
    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                description: data.description,
                organizationId: orgId,
                key: data.key,
            },
        });

        return project;
    } catch (error) {
        console.error("Error creating project:", error.message);
        throw new Error("Failed to create project");
        
    }
}

export async function getProject(projectId) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if( !userId || !orgId) {
        throw new Error("Unauthorized");
    }
    try {
        const user  = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const project = await db.project.findUnique({
            where: { id: projectId },
            include: {
                sprints: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                }
            },
        });

        if (!project) {
            return null;
        }

        if(project.organizationId !== orgId) {
            throw new Error("Unauthorized access to project");
        }
        return project;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw new Error("Failed to fetch projects");
        
    }
}

export async function deleteProject(projectId) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;
    const orgRole = sessionClaims?.o?.rol;

if (!userId || !orgId) {
    throw new Error("Unauthorized");
}

if (orgRole !== "admin") {
    throw new Error("Only organization admins can delete projects");
}

const project = await db.project.findUnique({
    where: { id: projectId },
});

if (!project || project.organizationId !== orgId) {
    throw new Error(
    "Project not found or you don't have permission to delete it"
    );
}

await db.project.delete({
    where: { id: projectId },
});

return { success: true };
}