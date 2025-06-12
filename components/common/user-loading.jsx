'use client'
import { useOrganization, useUser } from '@clerk/nextjs'
import {BarLoader} from 'react-spinners'
import React from 'react'

const UserLoading = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    if (!isLoaded || !isUserLoaded) {
        return (
            <BarLoader className='mb-4' width={"100%"} color="#ffffff" />
        )
    } else <></>;
}

export default UserLoading;