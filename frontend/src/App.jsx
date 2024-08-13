import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthContextProvider } from "./context/AuthContext";
import { NavbarProvider } from "./context/NavbarContext";
import PrivateRoute from "./utils/PrivateRoute";
import { Toaster } from "react-hot-toast";
import OtherProjects from "./pages/OtherProjects";
import UserProjectsPage from "./pages/UserProjectsPage";
import EditProfilePage from "./pages/EditProfilePage";
import { UserProvider } from "./context/UserContext";

const router = createBrowserRouter([
  {
    element: (
      <AuthContextProvider>
        <UserProvider>
          <NavbarProvider>
            <AppLayout />
          </NavbarProvider>
        </UserProvider>
      </AuthContextProvider>
    ),
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/projects", element: <Projects /> },
          { path: "/discover", element: <OtherProjects /> },
          { path: "user/:userId/projects", element: <UserProjectsPage /> },
          { path: "/edit-profile", element: <EditProfilePage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
