"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import {
Popover,
PopoverTrigger,
PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { sprintSchema } from "@/lib/zodValidators";
import useFetch from "@/app/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";

export default function SprintCreationForm({ projectTitle, projectKey, projectId, sprintKey }) {
const [showForm, setShowForm] = useState(false);
const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
});

const router = useRouter();
const { loading: createSprintLoading, fn: createSprintFn } = useFetch(createSprint);

const {
    register,
    control,
    handleSubmit,
    formState: { errors },
} = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
    name: `${projectKey}-${sprintKey}`,
    startDate: dateRange.from,
    endDate: dateRange.to,
    },
});

const onSubmit = async (data) => {
    await createSprintFn(projectId, {
    ...data,
    startDate: dateRange.from,
    endDate: dateRange.to,
    });
    setShowForm(false);
    router.refresh();
};

return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-indigo-500">
        {projectTitle}
        </h1>
        <Button
        onClick={() => setShowForm(!showForm)}
        variant={showForm ? "destructive" : "default"}
        >
        {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
    </div>

    {showForm && (
        <Card className="bg-background border shadow-sm">
        <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                Sprint Name
                </label>
                <Input
                id="name"
                {...register("name")}
                readOnly
                className="bg-muted/20"
                />
                {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                Sprint Duration
                </label>
                <Controller
                control={control}
                name="dateRange"
                render={({ field }) => (
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-muted/20"
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from && dateRange?.to ? (
                            `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`
                        ) : (
                            "Select date range"
                        )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-background" align="start">
                        <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={(range) => {
                            if (range?.from && range?.to) {
                            setDateRange(range);
                            field.onChange(range);
                            }
                        }}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                        captionLayout="dropdown"
                        />
                    </PopoverContent>
                    </Popover>
                )}
                />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
                </Button>
            </div>
            </form>
        </CardContent>
        </Card>
    )}
    </div>
);
}