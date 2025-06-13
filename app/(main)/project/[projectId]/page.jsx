import { getProject } from '@/actions/projects';
import { notFound } from 'next/navigation';
import SprintCreateForm from '@/app/(main)/project/_components/sprint-create';
import React from 'react'

const ProjectPage = async ({ params }) => {
  
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }
  return (
    <div className="container mx-auto p-4">
      <div>
        <SprintCreateForm
          projectId={projectId}
          projectTitle={project.name}
          projectDescription={project.description}
          sprintKey={project.sprints?.length + 1}
        />
      </div>
      <div>
        {project.sprints.length > 0 ? (
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <h2>Sprints</h2>
            <ul>
              {project.sprints.map(sprint => (
                <li key={sprint.id}>
                  <h3>{sprint.name}</h3>
                  <p>{sprint.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <p>No sprints available for this project.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectPage