import axios from "axios";

export const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to delete a project.");
  }

  try {
    await axios.delete(`http://localhost:3000/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.error("Error deleting project:", err);
    throw new Error("An error occurred while deleting the project.");
  }
};

export const toggleProjectVisibility = async (projectId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("You must be logged in to update a project.");
  }

  try {
    const response = await axios.put(
      `http://localhost:3000/projects/${projectId}/toggle-visibility`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error toggling project visibility:", err);
    throw new Error("An error occurred while updating the project visibility.");
  }
};
