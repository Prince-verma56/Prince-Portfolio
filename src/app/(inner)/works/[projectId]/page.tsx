import { notFound } from "next/navigation";
import { projectsData } from "@/data/projectsData";
import ProjectDetailLayout from "@/components/ProjectDetailLayout";

interface PageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = projectsData.find((p) => p.id === projectId);

  if (!project) {
    notFound();
  }

  return <ProjectDetailLayout project={project} />;
}
