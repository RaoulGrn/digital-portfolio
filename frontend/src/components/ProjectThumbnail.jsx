import { ExternalLink } from "react-feather";

const ProjectThumbnail = ({ project }) => (
  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3 transition-all duration-300 hover:bg-opacity-70">
    <div className="aspect-w-16 aspect-h-9 mb-2">
      <img
        className="object-cover rounded-lg w-full h-full"
        src={project.images[0]}
        alt={project.title}
      />
    </div>
    <h3 className="font-semibold text-sm text-teal-300 mb-1 truncate">
      {project.title}
    </h3>
    <p className="text-xs text-gray-300 line-clamp-2 mb-2">
      {project.description}
    </p>
    {project.clientUrl && (
      <a
        href={
          project.clientUrl.startsWith("http")
            ? project.clientUrl
            : `https://${project.clientUrl}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center text-xs text-teal-400 hover:text-teal-300 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={12} className="mr-1" />
        Visit
      </a>
    )}
  </div>
);

export default ProjectThumbnail;
