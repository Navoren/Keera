import { getProject } from '@/actions/projects';
import { notFound } from 'next/navigation';
import SprintCreateForm from '@/app/(main)/project/_components/sprint-create';
import React from 'react'
import { MessageCircleOff } from 'lucide-react';
import SprintBoard from '@/app/(main)/project/_components/sprint-board';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

const ProjectPage = async ({ params }) => {
  
  const { projectId } = await params;
  const project = await getProject(projectId);

  const shortName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals, colors],
  length: 2
});

  if (!project) {
    notFound();
  }
  return (
    <div className="container mx-auto p-4">
      <div>
        <SprintCreateForm
          projectId={projectId}
          projectTitle={project.name}
          projectKey={project.key}
          projectDescription={project.description}
          sprintKey={project.name + shortName}
        />
      </div>
      <div>
        {project.sprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground mt-20 space-y-4">
                  <MessageCircleOff className="w-24 h-24 text-grey" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Oops! No Sprints in Sight</h3>
                    <p className="text-sm text-muted-foreground">
                      Looks like your sprints are still stretching... or just ghosted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hit <span className="font-medium text-foreground">"Create New Sprint"</span> and get this project running!
                    </p>
                  </div>
                </div>
        ) : (
          <div className='py-4'>
            <h2 className='text-2xl font-bold'>Sprints</h2>
              <SprintBoard
                sprints={project.sprints}
                projectId={projectId}
                orgId = {project.organizationId}
              />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectPage