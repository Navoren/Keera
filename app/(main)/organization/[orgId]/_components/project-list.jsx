import React from 'react'
import { getProjects } from '@/actions/organizations'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderKanban, FolderX } from 'lucide-react'
import DeleteProject from './delete-project'

const ProjectList = async ({ orgId }) => {
  const projects = await getProjects(orgId)

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-20 space-y-4">
        <FolderX className="w-24 h-24 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">No Projects Found</h3>
          <p className="text-sm text-muted-foreground">
            You haven’t created any projects for this organization yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Use the <span className="font-medium text-foreground">"Create Project"</span> button above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {projects.map((project) => (
      <Card
        key={project.id}
        className="
          group relative overflow-hidden rounded-2xl
          transition-shadow transition-[ring] duration-500
          hover:shadow-lg
          hover:ring-2 hover:ring-primary/50
        "
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <FolderKanban className="h-5 w-5 text-primary" />
            <span>{project.name}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">
            {project.description || 'No description provided.'}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4">
          <Link href={`/project/${project.id}`}>
            <Button size="sm" variant="outline">
              View
            </Button>
          </Link>
          <DeleteProject projectId={project.id} />
        </CardFooter>
      </Card>
    ))}
  </div>
)
}

export default ProjectList
