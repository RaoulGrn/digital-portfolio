import React, { useState, useRef, useCallback, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import ImageModal from "../components/ImageModal";
import CreateProjectForm from "../components/CreateProjectForm";
import EditProjectForm from "../components/EditProjectForm";
import ProjectSidebar from "../components/ProjectSidebar.jsx";
import ProjectGrid from "../components/ProjectGrid";
import ProjectDetailView from "../components/ProjectDetailView";
import useProjects from "../hooks/useProjects";
import { useNavbarContext } from "../context/NavbarContext.jsx";
import {
  deleteProject,
  toggleProjectVisibility,
} from "../utils/projectActions.jsx";
import { PlusCircle, X } from "lucide-react";

function Projects() {
  const { user } = useAuthContext();
  const { projects, setProjects, loading, error } = useProjects(user);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const editFormRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isNavbarOpen } = useNavbarContext();

  const handleProjectCreated = (newProject) => {
    setProjects([...projects, newProject]);
    setShowCreateForm(false);
    setSelectedProject(newProject);
  };

  const handleProjectUpdated = (updatedProject) => {
    setProjects(
      projects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project
      )
    );
    setEditingProject(null);
    setSelectedProject(updatedProject);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setEditingProject(null);
    setShowCreateForm(false);
    setSidebarOpen(false);
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setSelectedProject(null);
    setShowCreateForm(false);
    setSidebarOpen(false);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProject(null);
    setEditingProject(null);
    setShowCreateForm(false);
  };

  const handleImageClick = useCallback((e, image) => {
    e.stopPropagation();
    setSelectedImage(image);
  }, []);

  const handleCloseImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleCloseProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
    setProjects(projects.filter((project) => project._id !== projectId));
    setSelectedProject(null);
  };

  const handleToggleVisibility = async (projectId) => {
    const updatedProject = await toggleProjectVisibility(projectId);
    setProjects(
      projects.map((project) =>
        project._id === projectId ? updatedProject : project
      )
    );
    if (selectedProject && selectedProject._id === projectId) {
      setSelectedProject(updatedProject);
    }
  };

  useEffect(() => {
    if (editingProject && editFormRef.current) {
      const firstInput = editFormRef.current.querySelector("input, textarea");
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [editingProject]);

  const filteredProjects = {
    all: projects,
    visible: projects.filter((p) => p.isVisible),
    hidden: projects.filter((p) => !p.isVisible),
  };

  useEffect(() => {
    if (isNavbarOpen) {
      setSidebarOpen(false);
    }
  }, [isNavbarOpen]);

  const toggleSidebar = useCallback((e) => {
    e.stopPropagation();
    setSidebarOpen((prev) => !prev);
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-teal-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen text-gray-200">
      {!isNavbarOpen && (
        <button
          className="md:hidden fixed top-20 left-6 z-50 bg-teal-500 text-white p-2 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : "☰"}
        </button>
      )}

      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar
          projects={projects}
          onProjectSelect={handleProjectSelect}
          onCategorySelect={handleCategorySelect}
          activeCategory={activeCategory}
          sidebarOpen={sidebarOpen}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
            >
              <PlusCircle size={24} className="mr-2" />
              {showCreateForm ? "Hide Form" : "Add New Project"}
            </button>
          </div>
          {showCreateForm && (
            <CreateProjectForm onProjectCreated={handleProjectCreated} />
          )}
          {editingProject && (
            <div ref={editFormRef}>
              <EditProjectForm
                project={editingProject}
                onProjectUpdated={handleProjectUpdated}
                onCancel={() => setEditingProject(null)}
              />
            </div>
          )}
          <ProjectGrid
            projects={filteredProjects[activeCategory]}
            onProjectSelect={handleProjectSelect}
          />
        </div>
      </div>

      {selectedProject && (
        <ProjectDetailView
          project={selectedProject}
          onClose={handleCloseProject}
          onToggleVisibility={handleToggleVisibility}
          onDelete={handleDeleteProject}
          onEdit={handleEditClick}
          onImageClick={handleImageClick}
        />
      )}

      {selectedImage && (
        <ImageModal imageUrl={selectedImage} onClose={handleCloseImage} />
      )}
    </div>
  );
}

export default Projects;
