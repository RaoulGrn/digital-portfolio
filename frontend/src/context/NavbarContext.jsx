import React, { createContext, useState, useContext } from "react";

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <NavbarContext.Provider value={{ isNavbarOpen, setIsNavbarOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbarContext = () => useContext(NavbarContext);
