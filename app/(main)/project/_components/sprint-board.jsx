'use client';
import React, { useState } from 'react'
import SprintManager from './sprint-manager';
const SprintBoard = ({ sprints, projectId, orgId }) => {
    console.log('Sprint', sprints);
    const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );

return (
    <div>
        <div>
            <SprintManager
                sprint={currentSprint}
                setSprint={setCurrentSprint}
                sprints={sprints}
                projectId={projectId}
            />
        </div>
        <div>
            
        </div>
    </div>
)
}

export default SprintBoard