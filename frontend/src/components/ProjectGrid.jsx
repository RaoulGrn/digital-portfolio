import React from "react";
import { Eye, EyeOff } from "lucide-react";

const ProjectGrid = ({ projects, onProjectSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {projects.map((project) => (
        <div
          key={project._id}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-102 hover:-translate-y-1 cursor-pointer group"
          onClick={() => onProjectSelect(project)}
        >
          <div className="relative h-48 w-full overflow-hidden">
            {project.images && project.images.length > 0 ? (
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 text-gray-400">
                No image available
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center">
              <span className="text-white text-sm font-semibold px-3 py-1 bg-teal-500 rounded-full">
                View Project
              </span>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-xl font-bold mb-2 text-teal-300 truncate group-hover:text-teal-200 transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {project.description}
            </p>
            <div className="flex flex-col items-center">
              <span
                className={`text-xs px-4 py-1 rounded-full flex items-center ${
                  project.isVisible
                    ? "bg-teal-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {project.isVisible ? (
                  <Eye size={14} className="mr-1" />
                ) : (
                  <EyeOff size={14} className="mr-1" />
                )}
                {project.isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;
