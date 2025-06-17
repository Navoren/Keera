import { getProject } from '@/actions/projects';
import { notFound } from 'next/navigation';
import SprintCreateForm from '@/app/(main)/project/_components/sprint-create';
import SprintBoard from '@/app/(main)/project/_components/sprint-board';
import { MessageCircleOff } from 'lucide-react';
import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';
import React from 'react';

const ProjectPage = async ({ params }) => {
  const { projectId } = params;
  const project = await getProject(projectId);

  if (!project) notFound();

  const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <SprintCreateForm
          projectId={projectId}
          projectTitle={project.name}
          projectKey={project.key}
          projectDescription={project.description}
          sprintKey={project.name + shortName}
        />
      </div>
      <div className="border-t border-slate-700" />
      
      {project.sprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-slate-400 mt-20 space-y-4">
          <MessageCircleOff className="w-20 h-20 text-slate-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-200">
              💤 Oops! No Sprints in Sight
            </h3>
            <p className="text-sm">
              Looks like your sprints are still stretching... or just ghosted.
            </p>
            <p className="text-sm">
              Hit <span className="font-medium text-indigo-400">"Create New Sprint"</span> and get this project running!
            </p>
          </div>
        </div>
      ) : (
        <div className="py-4">
          <h2 className="text-2xl font-bold text-indigo-400 mb-2">🚀 Active Sprints</h2>
          <SprintBoard
            sprints={project.sprints}
            projectId={projectId}
            orgId={project.organizationId}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
