import { MapPin } from "react-feather";
import { highlightText } from "../utils/HighlightText";
import ProjectThumbnail from "./ProjectThumbnail";

const UserCard = ({ user, searchQuery, onClick }) => {
  const visibleProjects = user.projects.filter((project) => project.isVisible);
  const displayedProjects = visibleProjects.slice(0, 2);
  const remainingProjects = visibleProjects.length - 2;

  return (
    <div className="p-5 h-full">
      <div
        className="group bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl cursor-pointer hover:scale-[1.02] h-full transform"
        onClick={() => onClick(user._id)}
      >
        <div className="p-4 relative z-10 h-full flex flex-col">
          <div className="flex items-center space-x-3 mb-3">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-300 ring-offset-2 ring-offset-gray-800"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-teal-300 group-hover:text-teal-200 transition-colors duration-300">
                {highlightText(user.username, searchQuery)}
              </h2>
              {(user.city || user.country) && (
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <MapPin size={12} className="mr-1 text-teal-400" />
                  <span>
                    {[user.city, user.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
          {displayedProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 mt-3 flex-grow">
              {displayedProjects.map((project) => (
                <ProjectThumbnail key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-700 bg-opacity-50 rounded-lg p-4 mt-3 flex-grow flex items-center justify-center text-center">
              <div>
                <p className="text-teal-300 font-semibold mb-2">
                  No projects yet
                </p>
                <p className="text-gray-400 text-sm">
                  This creative mind is brewing something amazing.
                  <br />
                  Check back soon for exciting projects!
                </p>
              </div>
            </div>
          )}
          {remainingProjects > 0 && (
            <p className="text-teal-400 font-medium mt-3 text-sm group-hover:text-teal-300 transition-colors duration-300">
              + another {remainingProjects} proiects
              {remainingProjects !== 1 ? "e" : ""}
            </p>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-teal-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default UserCard;
