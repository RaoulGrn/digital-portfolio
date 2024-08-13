const ProjectCard = ({ project, onImageClick }) => (
  <div className="bg-gray-900 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 hover:border-teal-500">
    <h3 className="text-3xl font-bold mb-4 text-white">{project.title}</h3>
    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
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
        className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors duration-300 mb-6 text-lg font-semibold shadow-md hover:shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink size={20} className="mr-2" />
        Vizitează Proiectul
      </a>
    )}

    <div className="grid grid-cols-2 gap-4">
      {project.images.slice(0, 4).map((image, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-xl cursor-pointer transform transition-all duration-300 hover:scale-105"
          onClick={() => onImageClick(image)}
        >
          <img
            src={image}
            alt={`Project ${index + 1}`}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              Vezi Imaginea
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProjectCard;
