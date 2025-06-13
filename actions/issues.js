'use server';

import {db} from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    let user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    const lastIssue = await db.issue.findFirst({
        where: { projectId: projectId },
        orderBy: { order: 'desc' },
    });

    const newOrder = lastIssue ? lastIssue.order + 1 : 1;

    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status || 'OPEN',
            priority: data.priority,
            projectId: projectId,
            sprintId: data.sprintId,
            assigneeId: data.assigneeId || null,
            reporterId: user?.id,
            order: newOrder
        },
        include: {
            assignee: true,
            reporter: true,
            project: true,
            sprint: true,
        },
    });

    return issue;
}

export async function getIssuesForSprint(sprintId) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

    return issues;
}

export async function updateIssueOrder(updatedIssues) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      });
    }
  });
    return { message: "Issue order updated successfully" };
}

export async function updateIssue(issueId, data) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    try {
        const issue = await db.issue.findUnique({
            where: { id: issueId },
            include: {
                project: true,
            },
        });
        if (!issue) {
            throw new Error("Issue not found");
        }
        if (issue.project.organizationId !== orgId) {
            throw new Error("Unauthorized access to issue");
        }
        const updatedIssue = await db.issue.update({
            where: { id: issueId },
            data: {
                status: data.status,
                priority: data.priority,
            },
            include: {
                assignee: true,
                reporter: true,
            },
        });

        return updatedIssue;
    } catch (error) {
        console.error("Error updating issue:", error);
        throw new Error("Failed to update issue");
        
    }
}

export async function deleteIssue(issueId) {
    const { userId, sessionClaims } = await auth();
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const issue = await db.issue.findUnique({
            where: { id: issueId },
            include: {
                project: true,
            },
        });
        if (!issue) {
            throw new Error("Issue not found");
        }
        if (issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)) {
            throw new Error("Unauthorized access to issue");
        }

        await db.issue.delete({
            where: { id: issueId },
        });

        return { message: "Issue deleted successfully" };
    } catch (error) {
        console.error("Error deleting issue:", error);
        throw new Error("Failed to delete issue");
        
    }
}