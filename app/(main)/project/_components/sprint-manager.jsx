'use client';

import { updateSprintStatus } from '@/actions/sprints';
import useFetch from '@/app/hooks/use-fetch';
import { formatDistanceToNow, isAfter, isBefore, format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarLoader } from 'react-spinners';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {
    const [status, setStatus] = useState(sprint.status);
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        fn: updateStatus,
        loading,
        error,
        data: updatedStatus
    } = useFetch(updateSprintStatus);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
    const canEnd = status === 'ACTIVE';

    const handleStatusChange = async (newStatus) => {
        updateStatus(sprint.id, newStatus);
    }

    useEffect(() => {
        if (updatedStatus && updatedStatus.success) {
            setStatus(updatedStatus.sprint.status);
            setSprint({
                ...sprint,
                status: updatedStatus.sprint.status,
            });
        }
    }, [updatedStatus, loading]);

    const getStatusText = () => {
        if (status === 'COMPLETED') {
            return `Sprint Ended`;
        }
        if (status === 'ACTIVE' && isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`
        }
        if (status === 'PLANNED' && isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)}`
        }
        return null;
    };

    useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
    const selectedSprint = sprints.find((s) => s.id === sprintId);
    if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
    }
    }
    }, [searchParams, sprints]);
    
    const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined, { shallow: true });
};

return (
<div className='py-8'>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <Select value={sprint.id} onValueChange={handleSprintChange}>
        <SelectTrigger className="bg-muted text-foreground">
        <SelectValue placeholder="Select Sprint" />
        </SelectTrigger>
        <SelectContent>
        {sprints.map((sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
            {sprint.name} (
            {format(sprint.startDate, "MMM d, yyyy")} to{" "}
            {format(sprint.endDate, "MMM d, yyyy")})
            </SelectItem>
        ))}
        </SelectContent>
    </Select>

    <div className="flex gap-2">
        {canStart && (
        <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
        >
            Start Sprint
        </Button>
        )}
        {canEnd && (
        <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
        >
            End Sprint
        </Button>
        )}
    </div>
    </div>

    {loading && (
    <BarLoader
        width="100%"
        height={4}
        className="mt-3 rounded"
        color="white"
    />
    )}

    {getStatusText() && (
    <Badge variant="outline" className="mt-4">
        {getStatusText()}
    </Badge>
    )}
</div>
);

}

export default SprintManager