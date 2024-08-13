import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ExternalLink } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import UserInfo from "../components/UserInfo";
import MobileNavLink from "../components/CustomMobileNavLink";
import { IoMdArrowBack } from "react-icons/io";

function UserProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  const fetchUserInfo = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }, [userId]);

  const fetchProjects = useCallback(async () => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/users/${userId}/projects?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { projects: newProjects, pages } = response.data;

      if (newProjects.length === 0) {
        setHasMore(false);
      } else {
        setProjects((prevProjects) => {
          const uniqueNewProjects = newProjects.filter(
            (newProject) =>
              !prevProjects.some((project) => project._id === newProject._id)
          );
          return [...prevProjects, ...uniqueNewProjects];
        });
        setPage((prevPage) => prevPage + 1);
        setHasMore(page < pages);
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [userId, page, hasMore]);

  useEffect(() => {
    fetchUserInfo();
    fetchProjects();
  }, [fetchUserInfo, fetchProjects]);

  if (loading && projects.length === 0)
    return <div className="text-center text-gray-200 mt-8">Loading...</div>;

  return (
    <div className="bg-gradient-custom min-h-screen text-gray-200">
      <div className="container mx-auto px-4 py-12">
        {userInfo && <UserInfo userInfo={userInfo} />}
        <div className="flex space-x-5 p-5 mb-5">
          <div className="translate-y-2 p-0.4 flex justify-center bg-gradient-signup rounded translate-x-6">
            <IoMdArrowBack className="h-10 w-10" />
            <MobileNavLink to="/discover" label="Go Back" />
          </div>
        </div>

        <InfiniteScroll
          dataLength={projects.length}
          next={fetchProjects}
          hasMore={hasMore}
          loader={
            <h4 className="text-center text-gray-400 my-4">Loading...</h4>
          }
          endMessage={
            <p className="text-center text-2xl text-gray-200 mt-10 my-4">
              You've seen all the projects!
            </p>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <h3 className="text-2xl font-semibold mb-3 text-teal-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                {project.clientUrl && (
                  <a
                    href={
                      project.clientUrl.startsWith("http")
                        ? project.clientUrl
                        : `https://${project.clientUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 mb-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={18} className="mr-2" />
                    Visit Project
                  </a>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {project.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-lg cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Project ${index + 1}`}
                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl w-full p-4 relative">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-all duration-200"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProjectsPage;
