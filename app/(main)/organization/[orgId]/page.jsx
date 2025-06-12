import { getOrganization } from '@/actions/organizations';
import React from 'react'
import OrgSwitcher from '@/components/org-switcher';
import ProjectList from '@/app/(main)/organization/[orgId]/_components/project-list';

const OrgId = async ({ params }) => {
    const { orgId } = await params;
    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization not found</div>;
    }
    return (
      <div className="container mx-auto px-4 py-8">
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-4xl font-bold text-indigo-500'>{organization.name}&rsquo;s projects</h1>
                <OrgSwitcher />
            </div>
            <div>
                <div className="mb-4"> 
                    <ProjectList orgId = {organization.id} />
                </div>
                {/* <div className='mt-4'> Show user assigned and reported issues here</div> */}
            </div>
      </div>
  )
}

export default OrgId;