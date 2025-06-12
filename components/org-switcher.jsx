'use client';

import { useOrganization, useUser } from '@clerk/nextjs';
import React from 'react'
import { SignedIn } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { OrganizationSwitcher } from '@clerk/nextjs';

const OrgSwitcher = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const { pathname } = usePathname();
    
    if (!isLoaded || !isUserLoaded) {
        return null;
    }
return (
    <>
        <div>
            <SignedIn>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl="/organization/:slug"
                    afterSelectOrganizationUrl="/organization/:slug"
                    createOrganizationMode={
                        pathname === '/onboarding' ? 'naviagation' : 'modal'
                    }
                    createOrganizationUrl = '/onboarding'
                    appearance={{
        elements: {
            rootBox: {
                fontSize: '16px',
                padding: '12px'
            },
            organizationSwitcherTrigger: {
                color: 'white',
                borderColor: 'white',
                fontSize: '20px',
                padding: '12px',
                border: '1px solid grey',
                borderRadius: '8px',
                '&:hover': {
                color: 'black',
                backgroundColor: 'white'
            }
            },
            organizationSwitcherTriggerIcon: {
                color: 'text-white',
                '&:hover': {
                color: 'black'
            }
            }
        }
    }}
                />
            </SignedIn>
        </div>
    </>
)
}

export default OrgSwitcher