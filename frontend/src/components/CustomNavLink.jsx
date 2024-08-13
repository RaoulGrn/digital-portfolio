import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, label, buttonStyle, children }) => (
  <Link
    to={to}
    className={`${
      buttonStyle
        ? "bg-gradient-signup text-white hover:bg-gradient-signuphover"
        : "text-gray-300 hover:bg-gradient-signuphover hover:text-white"
    } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1`}
  >
    {children}
    <span>{label}</span>
  </Link>
);

export default NavLink;
