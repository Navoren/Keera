import { Suspense } from "react";
import { getUserIssues } from "@/actions/issues";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "@/components/issue-card";

const UserIssues = async ({ userId }) => {
    const issues = await getUserIssues(userId);

if (issues.length === 0) {
    return null;
}

const assignedIssues = issues.filter(
    (issue) => issue.assignee.clerkUserId === userId
);
const reportedIssues = issues.filter(
    (issue) => issue.reporter.clerkUserId === userId
);

return (
    <section className="space-y-6">
    <h1 className="text-4xl font-bold gradient-title">My Issues</h1>

    <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="bg-slate-800 border border-slate-700 rounded-xl">
        <TabsTrigger value="assigned" className='cursor-pointer'>Assigned to You</TabsTrigger>
        <TabsTrigger value="reported" className='cursor-pointer'>Reported by You</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
        <Suspense fallback={<FallbackLoader message="Loading assigned issues..." />}>
            <IssueGrid issues={assignedIssues} />
        </Suspense>
        </TabsContent>

        <TabsContent value="reported">
        <Suspense fallback={<FallbackLoader message="Loading reported issues..." />}>
            <IssueGrid issues={reportedIssues} />
        </Suspense>
        </TabsContent>
    </Tabs>
    </section>
);
};

const IssueGrid = ({ issues }) => {
return (
    <div className="grid gap-6 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
    ))}
    </div>
);
};

const FallbackLoader = ({ message }) => (
<div className="flex justify-center items-center py-6 text-slate-400 text-sm">
    {message}
</div>
);

export default UserIssues;
