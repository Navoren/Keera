'use client';

import { useState, useEffect } from "react";
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import UserAvatar from "./user-avatar";
import useFetch from "@/app/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { BarLoader } from "react-spinners";
import { ExternalLink, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteIssue, updateIssue } from "@/actions/issues";

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const statuses = [
{ name: "Todo", key: "TODO" },
{ name: "In Progress", key: "IN_PROGRESS" },
{ name: "In Review", key: "IN_REVIEW" },
{ name: "Done", key: "DONE" },
];

const IssueDialog = ({
issue,
isOpen,
onClose,
onDelete = () => {},
onUpdate = () => {},
borderCol = "",
}) => {
const [status, setStatus] = useState(issue.status);
const [priority, setPriority] = useState(issue.priority);
const { user } = useUser();
const { membership } = useOrganization();
const router = useRouter();
const pathname = usePathname();

const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
} = useFetch(updateIssue);

const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
} = useFetch(deleteIssue);

const canChange =
    user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

useEffect(() => {
    if (deleted) {
    onClose();
    onDelete();
    }
    if (updated) {
    onUpdate(updated);
    }
}, [deleted, updated]);

const handleDelete = async () => {
    deleteIssueFn(issue.id);
};

const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
};

const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
};

const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
};

const isProjectPage = !pathname.startsWith("/project/");

return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="space-y-6 bg-background/90 border border-border rounded-2xl shadow-xl">
        <DialogHeader>
            <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-semibold text-white">
                {issue.title}
            </DialogTitle>
            {isProjectPage && (
                <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
                >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Button>
            )}
            </div>
        </DialogHeader>

        {(updateLoading || deleteLoading) && (
            <BarLoader width="100%" color="white" />
        )}

        <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
                Status
            </span>
            <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                {statuses.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                    {option.name}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
            <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
                Priority
            </span>
            <Select
                value={priority}
                onValueChange={handlePriorityChange}
                disabled={!canChange}
            >
                <SelectTrigger className={`w-40 border ${borderCol}`}>
                <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                {priorityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                    {option}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>
            </div>
        </div>

        <div className="space-y-2">
            <h4 className="font-semibold text-slate-300">Description</h4>
            <MDEditor.Markdown
            source={issue.description || "--"}
            className="prose dark:prose-invert border rounded-md p-3 bg-slate-900"
            />
        </div>

        <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-muted-foreground">
                Assignee
            </h4>
            <UserAvatar user={issue.assignee} />
            </div>
            <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-muted-foreground">
                Reporter
            </h4>
            <UserAvatar user={issue.reporter} />
            </div>
        </div>

        {canChange && (
            <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                variant="destructive"
                className="w-full gap-2 cursor-pointer"
                disabled={deleteLoading}
                >
                <Trash2 className="w-4 h-4" />
                {deleteLoading ? "Deleting..." : "Delete Issue"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you sure you want to delete this issue?
                </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className='cursor-pointer'>
                    Yes, delete it
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        )}

        {(deleteError || updateError) && (
            <p className="text-sm text-red-500 text-center">
            {deleteError?.message || updateError?.message}
            </p>
        )}
        </DialogContent>
    </Dialog>
    </>
);
};

export default IssueDialog;
