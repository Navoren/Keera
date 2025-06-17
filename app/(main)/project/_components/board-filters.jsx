"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { XCircle, FilterX } from "lucide-react";
import { useEffect, useState } from "react";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const BoardFilters = ({ issues, onFilterChange }) => {
const [searchTerm, setSearchTerm] = useState("");
const [selectedAssignees, setSelectedAssignees] = useState([]);
const [selectedPriority, setSelectedPriority] = useState("");

const assignees = issues
    .map((issue) => issue.assignee)
    .filter(
    (item, index, self) =>
        item && index === self.findIndex((t) => t.id === item.id)
    );

useEffect(() => {
    const filteredIssues = issues.filter(
    (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
        selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority)
    );
    onFilterChange(filteredIssues);
}, [searchTerm, selectedAssignees, selectedPriority, issues]);

const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
    prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId]
    );
};

const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
};

const isFiltersApplied =
    searchTerm !== "" ||
    selectedAssignees.length > 0 ||
    selectedPriority !== "";

return (
    <div className="space-y-4">
    <div className="flex flex-col pr-2 sm:flex-row gap-4 sm:gap-6 mt-6">
        <Input
        className="w-full sm:w-72"
        placeholder="Search issues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex-shrink-0">
        <div className="flex gap-2 flex-wrap">
            {assignees.map((assignee, i) => {
            const selected = selectedAssignees.includes(assignee.id);
            return (
                <div
                key={assignee.id}
                className={`rounded-full ring transition-shadow duration-300 ease-in-out cursor-pointer ${
                    selected
                    ? "ring-2 ring-white shadow-[0_0_0.5rem_#fff5] scale-105"
                    : "ring-1 ring-black"
                } ${i > 0 ? "-ml-6" : ""}`}
                style={{ zIndex: i }}
                onClick={() => toggleAssignee(assignee.id)}
                >
                <Avatar className="h-10 w-10">
                    <AvatarImage src={assignee.imageUrl} />
                    <AvatarFallback>{assignee.name[0]}</AvatarFallback>
                </Avatar>
                </div>
            );
            })}
        </div>
        </div>

        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
        <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
            {priorities.map((priority) => (
            <SelectItem key={priority} value={priority}>
                {priority}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>

        {isFiltersApplied && (
        <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center text-red-400 hover:text-red-600"
        >
            <FilterX className="mr-1 h-5 w-5" /> Clear All
        </Button>
        )}
    </div>
    </div>
);
};

export default BoardFilters;
