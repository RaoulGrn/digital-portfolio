import React from "react";

function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-200">
          Welcome to Your Digital Portfolio
        </h1>
        <p className="text-lg mb-6 text-gray-200">
          Discover a seamless way to showcase your best creative work. Our
          platform offers a user-friendly interface to manage and display your
          portfolio, whether you're a designer, artist, or digital creator.
        </p>
        <p className="text-lg mb-6 text-gray-200">
          Start by adding your projects, upload stunning images, and include
          links to client websites. Enjoy a responsive and visually appealing
          experience across all devices.
        </p>
        <p className="text-lg text-gray-200">
          Additionally, you can explore and be inspired by other users' profiles
          and projects. Discover new ideas to elevate your own portfolio.
        </p>
      </div>
    </div>
  );
}

export default Home;
