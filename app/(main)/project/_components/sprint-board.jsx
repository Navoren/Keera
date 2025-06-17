"use client";

import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import useFetch from "@/app/hooks/use-fetch";
import IssueCard from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { toast } from "sonner";
import BoardFilters from "./board-filters";
import CreateIssueBox from "./issue-create";
import SprintManager from "./sprint-manager";

const statuses = [
{ name: "Todo", key: "TODO" },
{ name: "In Progress", key: "IN_PROGRESS" },
{ name: "In Review", key: "IN_REVIEW" },
{ name: "Done", key: "DONE" }
];

export default function SprintBoard({ sprints, projectId, orgId }) {
const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
const [selectedStatus, setSelectedStatus] = useState(null);

const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
} = useFetch(getIssuesForSprint);

const [filteredIssues, setFilteredIssues] = useState([]);

    const handleFilterChange = (newFilteredIssues) => {
        setFilteredIssues(newFilteredIssues);
}

useEffect(() => {
    setFilteredIssues(issues || []);
}, [issues]);

useEffect(() => {
    if (currentSprint.id) fetchIssues(currentSprint.id);
}, [currentSprint.id]);

const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
};

const handleIssueCreated = () => {
    fetchIssues(currentSprint.id);
};

const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
} = useFetch(updateIssueOrder);

const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
    toast.warning("Start the sprint to update board");
    return;
    }
    if (currentSprint.status === "COMPLETED") {
    toast.warning("Cannot update board after sprint end");
    return;
    }

    const { destination, source } = result;
    if (!destination) return;
    if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
    )
    return;

    const updatedIssues = JSON.parse(JSON.stringify(issues));
    const sourceIssues = updatedIssues
    .filter((issue) => issue.status === source.droppableId)
    .sort((a, b) => a.order - b.order);

    const destIssues =
    destination.droppableId === source.droppableId
        ? sourceIssues
        : updatedIssues
            .filter((issue) => issue.status === destination.droppableId)
            .sort((a, b) => a.order - b.order);

    const [movedIssue] = sourceIssues.splice(source.index, 1);

    if (destination.droppableId !== source.droppableId) {
    movedIssue.status = destination.droppableId;
    }

    destIssues.splice(destination.index, 0, movedIssue);

    destIssues.forEach((issue, index) => {
    issue.order = index;
    });

    if (destination.droppableId !== source.droppableId) {
    sourceIssues.forEach((issue, index) => {
        issue.order = index;
    });
    }

    const finalIssues = [
    ...updatedIssues.filter(
        (issue) =>
        issue.status !== source.droppableId &&
        issue.status !== destination.droppableId
    ),
    ...sourceIssues,
    ...destIssues,
    ];

    setIssues(finalIssues);
    setFilteredIssues(finalIssues);

    const issuesToUpdate = [...sourceIssues, ...destIssues];
    await updateIssueOrderFn(issuesToUpdate);
};

if (issuesError)
    return <div className="text-red-500 text-center">Error loading issues</div>;

return (
    <div className="flex flex-col space-y-6">
    <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
    />

        {issues && !issuesLoading && (
            <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
    )}

    {updateIssuesError && (
        <p className="text-red-500 mt-2 text-sm text-center">
        {updateIssuesError.message}
        </p>
    )}

    {(updateIssuesLoading || issuesLoading) && (
        <div className="flex justify-end mt-8">
        <SyncLoader color="#4F46E5" size={12} />
        </div>
    )}

    <div className="flex justify-end">
        {currentSprint.status !== "COMPLETED" && (
        <Button
            variant="outline"
            className="text-slate-300 hover:text-white hover:bg-slate-700"
            onClick={() => handleAddIssue("TODO")}
        >
            <Plus className="mr-2 h-4 w-4" />
            Create Issue
        </Button>
        )}
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900/90 backdrop-blur-lg p-4 rounded-xl border border-slate-700 shadow-inner">
        {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
            {(provided) => (
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-2 p-2 rounded-xl bg-slate-800/50 shadow-sm border border-slate-700"
                >
                <h3 className="font-semibold mb-2 text-center text-slate-100 tracking-wide">
                    {column.name}
                </h3>

                {filteredIssues
                    .filter((issue) => issue.status === column.key)
                    .sort((a, b) => a.order - b.order)
                    .map((issue, index) => (
                    <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                    >
                        {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                        >
                            <IssueCard
                            issue={issue}
                            onDelete={() => fetchIssues(currentSprint.id)}
                            onUpdate={(updated) => {
                                const updatedIssues = issues.map((i) =>
                                i.id === updated.id ? updated : i
                                );
                                setIssues(updatedIssues);
                                setFilteredIssues(updatedIssues);
                            }}
                            />
                        </div>
                        )}
                    </Draggable>
                    ))}

                {provided.placeholder}
                </div>
            )}
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
);
}