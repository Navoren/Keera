'use client';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react'
import { ShieldBan, Rocket } from 'lucide-react';
import OrgSwitcher from '@/components/org-switcher';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/app/hooks/use-fetch';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarLoader } from "react-spinners";
import { projectSchema } from "@/lib/zodValidators";
import { createProject } from "@/actions/projects";
import { useRouter } from 'next/navigation';

const ProjectCreate = () => {

    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    
    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver: zodResolver(projectSchema),
    })

    const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    createProjectFn(data);
  };

    useEffect(() => {
        if(isOrgLoaded && isUserLoaded) {
            if (membership?.role === 'org:admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        }
    }, [isOrgLoaded, isUserLoaded, membership]);

    const { loading, error, data: project, fn: createProjectFn} = useFetch(createProject);

    useEffect(() => {
    if (project) router.push(`/project/${project.id}`);
  }, [loading]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }
if(isAdmin) {
    return (
    <div className="relative flex flex-col items-center justify-center min-h-screen py-12 px-4">
    <Card className="w-full max-w-xl bg-gray-850 shadow-2xl rounded-3xl">
        <CardContent className="p-8 space-y-8">
        <h1 className="text-3xl font-semibold text-white text-center">
            Create a New Project
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
            <Label htmlFor="projectName" className="text-gray-300">Project Name</Label>
            <Input
                id="projectName"
                name="projectName"
                {...register('name')}
                placeholder="Awesome App"
                required
                className="mt-2"
                            />
                {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
            <Label htmlFor="key" className="text-gray-300">Project Key</Label>
            <Input
                id="key"
                name="key"
                {...register("key")}
                placeholder="SHORTNAME"
                required
                className="mt-2 uppercase"
            />
            {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            </div>

            <div>
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
                id="description"
                name="description"
                {...register("description")}
                rows={4}
                placeholder="Brief overview of this project"
                required
                className="mt-2"
                            />
                {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
                </p>
            )}
            </div>
            {loading && (
            <BarLoader className="mb-4" width={"100%"} color="indgo-700" />
            )}

            <div className="flex justify-end cursor-pointer">
            <Button size="sm" variant="outline" disabled={loading}>
            { loading ? "Creating..." : "Create Project"} <Rocket className="ml-2" />
            </Button>
            </div>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
        </form>
        </CardContent>
    </Card>

    <p className="mt-12 text-sm text-muted-foreground text-center italic">
        "Every great project starts with a single click."
    </p>
    </div>
);
}
return (
    <div className="min-h-screen flex items-center justify-center">
    <div className="max-w-sm text-center">
        <ShieldBan className="mx-auto text-red-500" size={96} />
        <h1 className="mt-6 text-4xl font-bold text-white">
        Access Denied
        </h1>
        <p className="mt-4 text-gray-300 leading-relaxed">
        You don’t have permission to create a project yet. <br />
        Contact your administrator to request access.
        </p>

        <div className="mt-8 border-t border-gray-700 pt-6">
        <h2 className="text-xl font-semibold text-white mb-4">
            Switch Organization
        </h2>
        <OrgSwitcher className="w-full" />
        </div>
    </div>
    </div>
);
}

export default ProjectCreate