import { UserButton } from '@clerk/nextjs'
import { ChartNetwork } from 'lucide-react'
import React from 'react'

const UserMenuBox = () => {
    return <UserButton appearance={{
        elements: {
            avatarBox: 'h-12 w-12',
            userButtonAvatarImage: 'rounded-full',
            userButtonPopoverCard: 'w-48',
            userButtonPopoverCardHeaderTitle: 'text-sm font-semibold',
            userButtonPopoverCardHeaderSubtitle: 'text-xs text-muted-foreground'
        }
    }}
    >
    <UserButton.MenuItems>
            <UserButton.Link href="/onboarding" label='My Organizations' labelIcon={<ChartNetwork size={15} />} />
            <UserButton.Action label='manageAccount' />
    </UserButton.MenuItems>

    </UserButton>
}

export default UserMenuBox