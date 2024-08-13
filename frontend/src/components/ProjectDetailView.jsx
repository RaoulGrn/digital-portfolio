import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";

const ProjectDetailView = ({
  project,
  onClose,
  onToggleVisibility,
  onDelete,
  onEdit,
  onImageClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
    );
  };

  const toggleImageZoom = () => {
    setIsImageZoomed((prevZoom) => !prevZoom);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 sm:p-4 z-50">
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-300 hover:text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1 sm:p-2 transition-all duration-200 ease-in-out"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-teal-300">
          {project.title}
        </h2>

        <div className="mb-4 sm:mb-6 relative">
          <div
            className={`w-full h-48 sm:h-64 md:h-80 lg:h-96 mb-2 sm:mb-4 ${
              isImageZoomed ? "max-h-[80vh]" : "max-h-96"
            }`}
          >
            <img
              src={project.images[currentImageIndex]}
              alt={`Project ${currentImageIndex + 1}`}
              className={`w-full h-full object-contain sm:object-cover rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
                isImageZoomed ? "max-h-[80vh] max-w-full object-contain" : ""
              }`}
              onClick={(e) => {
                toggleImageZoom();
                onImageClick(e, project.images[currentImageIndex]);
              }}
            />
          </div>
          <button
            onClick={prevImage}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-1 sm:p-2 transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-1 sm:p-2 transition-all duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center mb-4 sm:mb-6">
          {project.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mx-1 transition-all duration-200 ${
                index === currentImageIndex ? "bg-teal-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg leading-relaxed">
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
            className="inline-flex items-center text-teal-400 hover:text-teal-300 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={14} className="mr-1" />
            {project.clientUrl}
          </a>
        )}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 sm:gap-4">
          <button
            onClick={() => onToggleVisibility(project._id)}
            className={`flex items-center w-full sm:w-auto justify-center ${
              project.isVisible
                ? "bg-red-500 hover:bg-red-600"
                : "bg-teal-500 hover:bg-teal-600"
            } text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm sm:text-base`}
          >
            {project.isVisible ? (
              <EyeOff size={16} className="mr-2" />
            ) : (
              <Eye size={16} className="mr-2" />
            )}
            {project.isVisible ? "Hide Project" : "Show Project"}
          </button>
          <div className="flex w-full sm:w-auto space-x-2 sm:space-x-4">
            <button
              onClick={() => onDelete(project._id)}
              className="flex items-center justify-center flex-1 sm:flex-initial bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm sm:text-base"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
            <button
              onClick={() => onEdit(project)}
              className="flex items-center justify-center flex-1 sm:flex-initial bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out text-sm sm:text-base"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;
