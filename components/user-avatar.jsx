import React from "react";
import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar";

const getInitials = (name = "") => {
return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const UserAvatar = ({ user }) => {
const fallback = user?.name ? getInitials(user.name) : "?";

return (
    <div className="flex items-center gap-2 w-full">
    <Avatar className="h-7 w-7 border border-muted-foreground/20">
        <AvatarImage
        src={user?.imageUrl}
        alt={user?.name}
        title={user?.name}
        />
        <AvatarFallback className="text-xs font-medium">
        {fallback}
        </AvatarFallback>
    </Avatar>
    <span className="text-sm text-muted-foreground truncate max-w-[120px]">
        {user?.name || "Unassigned"}
    </span>
    </div>
);
};

export default UserAvatar;
