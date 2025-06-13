'use client';

import React, {useState} from 'react'
import { Button } from '@/components/ui/button';

const SprintCreateForm = ({ projectId, projectTitle, projectDescription, sprintKey }) => {
    const [showForm, setShowForm] = useState(false);
return (
    <>
        <div>
            <h1>{projectTitle}</h1>
            <Button
                className='mt-2'
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? 'destructive' : 'default'}
            >
                {showForm ? 'Cancel' : 'Create Sprint'}
            </Button>
        </div>

        <div>
            {showForm ? (
                <form>
                    <div>
                        <label htmlFor="sprintName">Sprint Name</label>
                        <input type="text" id="sprintName" name="sprintName" required />
                    </div>
                    <div>
                        <label htmlFor="sprintDescription">Sprint Description</label>
                        <textarea id="sprintDescription" name="sprintDescription" required></textarea>
                    </div>
                    <Button type="submit">Create Sprint</Button>
                </form>
            ) : (
                <Button onClick={() => setShowForm(true)}>Create New Sprint</Button>
            )}
        </div>
    </>
)
}

export default SprintCreateForm