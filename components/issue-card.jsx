import React from "react";
import {
Card,
CardContent,
CardFooter,
CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon, AlarmClock, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "./user-avatar";
import IssueDialog from "./issue-dialog";
import { useRouter } from "next/router";

const priorityColors = {
  LOW: "text-teal-300 border-teal-500 bg-teal-900/40",
  MEDIUM: "text-sky-300 border-sky-500 bg-sky-900/40",
  HIGH: "text-amber-300 border-amber-500 bg-amber-900/40",
  URGENT: "text-rose-300 border-rose-500 bg-rose-900/40",
};


export default function IssueCard({ issue, showStatus = false }) {
const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
});

    const [isDialogOpen, setisDialogOpen] = useState(false);

    const router = useRouter();

    const onDeleteHandler = (...params) => {
        router.refresh();
        onDelete(...params);
    };

    const onUpdateHandler = (...params) => {
        router.refresh();
        onUpdate(...params);
    }

    return (
    <>
    <Card
    className={`cursor-pointer transition-all border-t-4 rounded-lg shadow-sm hover:shadow-lg hover:-rotate-1 hover:scale-[1.01] duration-300 ease-in-out ${priorityColors[issue.priority]}`}
    >
    <div className="p-4 space-y-3">
        <CardTitle className="text-base font-semibold text-foreground">
        {issue.title}
        </CardTitle>

        <CardContent className="p-0 flex items-center gap-2 text-sm flex-wrap">
        {showStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
            <AlarmClock className="w-4 h-4" />
            {issue.status}
            </Badge>
        )}
        <Badge
            variant="outline"
            className={`flex items-center gap-1 ${priorityColors[issue.priority]}`}
        >
            <Flag className="w-4 h-4" />
            {issue.priority}
        </Badge>
        </CardContent>

        <CardFooter className="p-0 flex justify-between items-center text-sm text-muted-foreground mt-1">
        <div className="flex items-center gap-2">
            <UserAvatar user={issue.assignee} size="sm" />
        </div>
        <div className="flex items-center gap-1 text-xs">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Created {created}</span>
        </div>
        </CardFooter>
    </div>
    </Card>

    {isDialogOpen && (
        <IssueDialog
            isOpen={isDialogOpen}
            onClose={() => setisDialogOpen(false)}
            issue={issue}
            onDelete={onDeleteHandler}
            onUpdate={onUpdateHandler}
            borderCol={priorityColors[issue.priority]}
        />
)}
</>
);
}
