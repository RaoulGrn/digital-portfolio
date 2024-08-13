import React, { useState } from "react";
import axios from "axios";
import { FaUpload } from "react-icons/fa";

function CreateProjectForm({ onProjectCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientUrl, setClientUrl] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create a project.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("clientUrl", clientUrl);
    for (let image of images) {
      formData.append("images", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onProjectCreated(response.data);
      setTitle("");
      setDescription("");
      setClientUrl("");
      setImages([]);
    } catch (err) {
      console.error("Error creating project:", err);
      setError("An error occurred while creating the project.");
    }
  };

  return (
    <div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-200">
            Create New Project
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <input
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-700"
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Description
              </label>
              <textarea
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-700"
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="clientUrl" className="sr-only">
                Client URL
              </label>
              <input
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-700"
                id="clientUrl"
                type="url"
                placeholder="Client URL"
                value={clientUrl}
                onChange={(e) => setClientUrl(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="images" className="sr-only">
                Upload Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG or GIF</p>
                  </div>
                  <input
                    id="images"
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => setImages(e.target.files)}
                  />
                </label>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className={`group relative border-sky-100 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-signup hover:bg-gradient-signuphover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out`}
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectForm;
