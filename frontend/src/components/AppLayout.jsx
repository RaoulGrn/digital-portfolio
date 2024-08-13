import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { NavbarProvider } from "../context/NavbarContext";

function AppLayout() {
  return (
    <NavbarProvider>
      <div className="flex bg-gradient-custom flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <div className="">
            <Outlet />
          </div>
        </main>

        <footer className="bg-gradient-nav text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center">
              &copy; 2024 Raoul Tanase. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </NavbarProvider>
  );
}

export default AppLayout;
