"use client";

import React, { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/app/hooks/use-fetch";
import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organizations";
import { BarLoader } from "react-spinners";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";
import { issueSchema } from "@/lib/zodValidators";
import { toast } from "sonner";

export default function CreateIssueBox({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      assigneeId: "",
      description: "",
      priority: "MEDIUM",
    },
  });

  const createIssueHandler = useFetch(createIssue);
  const {
    loading: createLoading,
    fn: createFn,
    reset: resetCreateIssue
  } = createIssueHandler;

  const fetchUsersHandler = useFetch(getOrganizationUsers);
  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = fetchUsersHandler;

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  useEffect(() => {
    if (createIssueHandler.data) {
      resetForm();
      onIssueCreated();
      onClose();
      toast.success('Issue created successfully');
      
      resetCreateIssue();
    }
  }, [createIssueHandler.data, onClose, onIssueCreated, resetForm, resetCreateIssue]);

  const onSubmit = async (data) => {
    try {
      await createFn(projectId, { 
        ...data, 
        sprintId, 
        status 
      });
    } catch (error) {
      // Error handled in useFetch hook
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
          <DrawerDescription>
            Fill out the form below to add a new issue to this sprint.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-6">
          {usersLoading && (
            <div className="flex justify-center py-4">
              <BarLoader width="100%" color="#3b82f6" />
            </div>
          )}

          {fetchUsersHandler.error && (
            <p className="text-red-500 text-sm mb-4">
              Error loading users: {fetchUsersHandler.error.message}
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Issue title"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Assignee Field */}
            <div className="space-y-2">
              <label htmlFor="assignee" className="text-sm font-medium">
                Assignee
              </label>
              <Controller
                name="assigneeId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={usersLoading || fetchUsersHandler.error}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.assigneeId && (
                <p className="text-red-500 text-sm">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    height={200}
                    value={field.value}
                    onChange={field.onChange}
                    previewOptions={{ rehypePlugins: [] }}
                  />
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Priority Field */}
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {createIssueHandler.error && (
              <p className="text-red-500 text-sm">
                {createIssueHandler.error.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={createLoading}
              className="w-full"
            >
              {createLoading ? "Creating..." : "Create Issue"}
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}