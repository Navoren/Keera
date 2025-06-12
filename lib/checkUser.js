import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const checkUser = async () => {
    const user = await currentUser();
    if (!user) {
        return null;
    }
    try {
        const loggedUser = await db?.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });
        if (!loggedUser) {
            const name = `${user.firstName} ${user.lastName}` || "Unknown User";

            const newUser = await db?.user.create({
                data: {
                    clerkUserId: user.id,
                    name: name,
                    imageUrl : user.imageUrl || "",
                    email: user.emailAddresses[0]?.emailAddress || ""
                },
            });
            return newUser;
        }
        return loggedUser;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user");
    }
}