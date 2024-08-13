import React from "react";
import { Link } from "react-router-dom";

const MobileNavLink = ({ to, label, onClick, buttonStyle, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`${
      buttonStyle
        ? "bg-gradient-signup text-white hover:bg-gradient-signuphover"
        : "text-gray-300 hover:bg-gradient-signuphover hover:text-white"
    } text-center flex items-center justify-center px-3 py-2 rounded-md text-base font-medium w-full`}
  >
    {children}
    <span className="ml-2">{label}</span>
  </Link>
);

export default MobileNavLink;
