import { getOrganization } from "@/actions/organizations";
import ProjectList from "@/app/(main)/organization/[orgId]/_components/project-list";
import OrgSwitcher from "@/components/org-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrgNotFound from "./_components/org-not-found";
import UserIssues from "./_components/user-issues";

const OrgId = async ({ params }) => {
const { orgId } = params;
const { userId } = await auth();

if (!userId) {
    redirect("/sign-in");
}

const organization = await getOrganization(orgId);

if (!organization) {
    return <OrgNotFound />;
}

return (
    <div className="container mx-auto px-6 py-10 space-y-10 text-slate-100">
    <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-indigo-600">
        <span className="text-indigo-300">{organization.name}</span>
        <span className="text-slate-400">&nbsp;/ Projects</span>
        </h1>
        <OrgSwitcher />
    </header>

    <hr className="border-slate-700" />

    <section className="space-y-6">
        <h2 className="text-xl font-medium text-slate-300">Active Projects</h2>
        <ProjectList orgId={organization.id} />
    </section>

    <section className="border-t border-slate-800 pt-10">
        <UserIssues userId={userId} />
    </section>
    </div>
);
};

export default OrgId;
