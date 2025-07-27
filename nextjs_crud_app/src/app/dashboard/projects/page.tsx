import { Suspense } from "react";
import ProjectListClient from "./ProjectListClient";

export default function ProjectsPage() {
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectListClient />
      </Suspense>
    </div>
  );
}
