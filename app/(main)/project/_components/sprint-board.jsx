'use client';
import React, { useEffect, useState } from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateIssueBox from './issue-create';
import { getIssuesForSprint, updateIssue, updateIssueOrder } from '@/actions/issues';
import { toast } from 'sonner';
import useFetch from '@/app/hooks/use-fetch';


const statuses = [
    {
        "name": "Todo",
        "key": "TODO"
    },
    {
        "name": "In Progress",
        "key": "IN_PROGRESS"
    },
    {
        "name": "In Review",
        "key": "IN_REVIEW"
    },
    {
        "name": "Done",
        "key": "DONE"
    }
];

const SprintBoard = ({ sprints, projectId, orgId }) => {
    const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const {
        loading: issuesloading,
        error: issuesError,
        fn: fetchIssues,
        data: issues,
        setData: setIssues,
    } = useFetch(getIssuesForSprint);

    const {
        fn: updateIssueOrderfn,
        loading: updateIssuesLoading,
        error : updateIssueError
    } = useFetch(updateIssueOrder);
    
    const [filteredIssues, setFilteredIssues] = useState(issues);

    const handleFilterChange = (newFilteredIssues) => {
        setFilteredIssues(newFilteredIssues);
    }

    useEffect(() => {
        if (currentSprint.id) {
            fetchIssues(currentSprint.id);
        }
    },[currentSprint.id])

    const onDragEnd = async (result) => {
        if (currentSprint.status === 'PLANNED') {
            toast.warning('Start the spint to update the board');
            return;
        }
        if (currentSprint.status === 'COMPLETED') {
            toast.warning('Cannot update board after sprint end');
            return;
        }

        const { destination, source } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newOrder = [...issues];

        const sourceList = newOrderData.filter(
            (list) => list.status === source.droppableId
        );

        const destinationList = newOrderData.filter(
            (list) => list.status === destination.droppableId
        );

        if (source.droppableId === destination.droppableId) {
            const reorderCards = render(
                sourceList,
                source.index,
                destination.index
            );

            reorderedCards.forEach((card, i) => {
                card.order = i;
            });
        } else {
            const [moveCard] = sourceList.splice(source.index, 1);

            movedCard.status = destination.droppableId;

            destinationList.splice(destination.index, 0, movedCard);

            sourceList.forEach((card, i) => {
                card.order = i;
            })

            sourceList.forEach((card, i) => {
                card.order = i;
            })
        }

        const sortedIssues = newOrderData.sort((a, b) => a.order - b.order);
        setIssues(newOrderData, sortedIssues);

        updateIssueOrderfn(sortedIssues);
    }

    const handleAddIssue = (status) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
    }

    const handleIssueCreated = () => {
        fetchIssues(currentSprint.id);

    }
    if (issuesError) return <div>Error fetching Orders</div>;

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
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg'>
                    {statuses.map((column) => (
                        <Droppable key={column.key} droppableId ={column.key}>
                            {(provided) => {
                                return (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className='space-y-2'
                                    >
                                        <h3 className='font-semibold text-center'>
                                            {column.name}
                                        </h3>
                                        {provided.placeholder}
                                        {column.key === 'TODO' && currentSprint.status !== "COMPLETED"
                                            && (
                                            <Button
                                                variant='outline'
                                                className='cursor-pointer'
                                                onClick={() => handleAddIssue(column.key)}>
                                                <Plus className='mr-2 h-4 w-4' />
                                                Create Issue
                                            </Button>
                                        )}
                                    </div>
                                )
                            }}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>

            <CreateIssueBox
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sprintId={currentSprint.id}
                status={selectedStatus}
                projectId={projectId}
                onIssueCreated={handleIssueCreated}
                orgId={orgId}
            />
        </div>
    </div>
)
}

export default SprintBoard