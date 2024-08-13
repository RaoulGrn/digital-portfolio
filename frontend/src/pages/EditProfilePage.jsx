import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { FaUpload } from "react-icons/fa";

const EditProfilePage = () => {
  const { user, updateUser } = useUser();
  const [profileData, setProfileData] = useState({
    biography: "",
    domain: "",
    city: "",
    country: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        biography: user.biography || "",
        domain: user.domain || "",
        city: user.city || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();

    Object.keys(profileData).forEach((key) => {
      if (profileData[key]) {
        formData.append(key, profileData[key]);
      }
    });

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated successfully:", response.data);
      toast.success("Profile updated successfully");
      updateUser(response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Edit Your Profile
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="profilePicture" className="sr-only">
                Upload Profile Picture
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="profilePicture"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaUpload className="w-8 h-8 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="profilePicture"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
            <div>
              <label htmlFor="biography" className="sr-only">
                Biography
              </label>
              <textarea
                id="biography"
                name="biography"
                rows="4"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-700"
                placeholder="Biography"
                value={profileData.biography}
                onChange={handleInputChange}
              />
            </div>
            {["domain", "city", "country"].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="sr-only">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={field}
                  name={field}
                  type="text"
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm bg-gray-700"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={profileData[field]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative border-sky-100 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isSubmitting
                  ? "bg-teal-600 cursor-not-allowed"
                  : "bg-gradient-signup hover:bg-gradient-signuphover"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out`}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
