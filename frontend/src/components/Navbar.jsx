import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useNavbarContext } from "../context/NavbarContext";
import { useUser } from "../context/UserContext";
import NavLink from "./CustomNavLink";
import MobileNavLink from "./CustomMobileNavLink";
import { IoLogOutOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { PiSignatureThin } from "react-icons/pi";

function Navbar() {
  const { isNavbarOpen, setIsNavbarOpen } = useNavbarContext();
  const { user: authUser, logout } = useAuthContext();
  const { user: userDetails } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsNavbarOpen(false);
  };

  const toggleNavbar = () => setIsNavbarOpen(!isNavbarOpen);
  const closeNavbar = () => setIsNavbarOpen(false);

  return (
    <nav className="bg-gradient-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0" onClick={closeNavbar}>
            <p className="text-white font-bold">DIGITAL PORTFOLIO</p>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" label="Home" />
            <NavLink to="/projects" label="My Projects" />
            <NavLink to="/discover" label="Discover" />
          </div>

          <div className="flex items-center">
            {authUser && (
              <div className="flex items-center mr-4">
                {userDetails && userDetails.profilePicture && (
                  <img
                    src={userDetails.profilePicture}
                    alt={authUser.username}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                )}
                <span className="text-gray-300 text-sm font-medium">
                  {authUser.username}
                </span>
                <MobileNavLink
                  to="/edit-profile"
                  label="Edit Profile"
                  onClick={closeNavbar}
                />
              </div>
            )}
            <div className="hidden md:block">
              {authUser ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gradient-signuphover flex items-center hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  <p>Logout</p>
                  <IoLogOutOutline className="h-5 w-5 text-red-800 mr-2 translate-x-2" />
                </button>
              ) : (
                <div className="flex items-center  space-x-2">
                  <NavLink
                    to="/login"
                    label="Login"
                    className="flex items-center space-x-1"
                  >
                    <IoLogInOutline className="h-5 w-5" />
                  </NavLink>
                  <div className="border rounded border-sky-100">
                    {" "}
                    <NavLink
                      to="/signup"
                      label="Sign Up"
                      buttonStyle
                      className="flex items-center space-x-1"
                    >
                      <PiSignatureThin className="h-5 w-5" />
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleNavbar}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isNavbarOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isNavbarOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 sm:px-3 flex flex-col items-center space-y-1">
            <MobileNavLink to="/" label="Home" onClick={closeNavbar} />
            <MobileNavLink
              to="/projects"
              label="My Projects"
              onClick={closeNavbar}
            />
            <MobileNavLink
              to="/discover"
              label="Discover"
              onClick={closeNavbar}
            />
            {authUser && (
              <MobileNavLink
                to="/edit-profile"
                label="Edit Profile"
                onClick={closeNavbar}
              />
            )}
            {authUser ? (
              <MobileNavLink
                onClick={handleLogout}
                className="flex items-center justify-center space-x-1"
              >
                <span>Logout</span>
                <IoLogInOutline className="h-5 w-5 text-red-800 translate-x-1" />
              </MobileNavLink>
            ) : (
              <>
                <div className="flex flex-col p-1 gap-2 w-full">
                  <MobileNavLink
                    to="/login"
                    label="Login"
                    onClick={closeNavbar}
                    className="flex items-center justify-center space-x-1"
                  >
                    <IoLogInOutline className="h-5 w-5" />
                  </MobileNavLink>
                  <div className="border rounded border-sky-200">
                    <MobileNavLink
                      to="/signup"
                      label="Sign Up"
                      onClick={closeNavbar}
                      buttonStyle
                      className="flex items-center  justify-center space-x-1"
                    >
                      <PiSignatureThin className="h-5 w-5" />
                    </MobileNavLink>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
