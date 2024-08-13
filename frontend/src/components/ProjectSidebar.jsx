import React from "react";

const ProjectSidebar = ({
  projects,
  onProjectSelect,
  onCategorySelect,
  activeCategory,
  sidebarOpen,
  onClick,
}) => {
  const categories = [
    { value: "all", label: "All Projects" },
    { value: "visible", label: "Visible Projects" },
    { value: "hidden", label: "Hidden Projects" },
  ];

  const filteredProjects = {
    all: projects,
    visible: projects.filter((p) => p.isVisible),
    hidden: projects.filter((p) => !p.isVisible),
  };

  const limitTitle = (title) => {
    const words = title.split(" ");
    if (words.length > 3) {
      return words.slice(0, 3).join(" ") + "...";
    }
    return title;
  };

  return (
    <div
      className={`md:w-64 md:flex-shrink-0 md:static fixed inset-y-16 left-0 transform ${
        sidebarOpen ? "translate-x-0 pl-14" : "-translate-x-full"
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 bg-gradient-nav md:p-8 h-full w-64 md:h-auto`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900 hover:scrollbar-thumb-gray-300">
          <div className="space-y-4 p-4">
            {categories.map((category) => (
              <div key={category.value}>
                <button
                  className={`w-full text-left py-2 px-4 rounded-lg transition duration-300 ease-in-out ${
                    activeCategory === category.value
                      ? "bg-gradient-signup text-white"
                      : "text-gray-300 hover:bg-gradient-signup"
                  }`}
                  onClick={() => onCategorySelect(category.value)}
                >
                  {category.label} ({filteredProjects[category.value].length})
                </button>
                {activeCategory === category.value &&
                  category.value !== "all" && (
                    <div className="ml-4 mt-2 space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-900">
                      {filteredProjects[category.value].map((project) => (
                        <div
                          key={project._id}
                          className="py-2 px-4 text-gray-200 hover:bg-gradient-signup cursor-pointer rounded transition duration-300 ease-in-out"
                          onClick={() => onProjectSelect(project)}
                        >
                          {limitTitle(project.title)}
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;
