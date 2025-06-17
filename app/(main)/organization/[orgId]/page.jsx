import { getOrganization } from '@/actions/organizations';
import React from 'react';
import OrgSwitcher from '@/components/org-switcher';
import ProjectList from '@/app/(main)/organization/[orgId]/_components/project-list';

const OrgId = async ({ params }) => {
const { orgId } = params;
const organization = await getOrganization(orgId);

if (!organization) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 text-lg">
        🚫 Organization not found.
    </div>
    );
}

return (
    <div className="container mx-auto px-6 py-10 space-y-8 text-slate-100">
    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-indigo-600">
        <span className="text-indigo-300">{organization.name}</span>
        <span className="text-slate-400">&nbsp;/ Projects</span>
        </h1>
        <OrgSwitcher />
    </div>

    <div className="border-t border-slate-700" />

    <div className="space-y-6">
        <h2 className="text-xl font-medium text-slate-300">Active Projects</h2>
        <ProjectList orgId={organization.id} />
    </div>

    {/* Future Expansion Placeholder */}
    {/* <div className="pt-6 border-t border-slate-800">
        <h3 className="text-lg text-slate-400 font-medium">Assigned / Reported Issues</h3>
        <p className="text-sm text-slate-500">Coming soon...</p>
    </div> */}
    </div>
);
};

export default OrgId;
