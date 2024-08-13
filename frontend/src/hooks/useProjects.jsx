import { useState, useEffect } from "react";
import axios from "axios";

const useProjects = (user) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!user || !token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/users/${userId}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("An error occurred while fetching projects.");
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return { projects, setProjects, loading, error };
};

export default useProjects;
