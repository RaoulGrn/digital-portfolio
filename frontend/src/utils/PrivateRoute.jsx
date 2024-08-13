import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const token = localStorage.getItem("token") || null;
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (token === null && !toastShownRef.current) {
      toast.error("Please log in first!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      toastShownRef.current = true;
    }
  }, []);

  console.log("PrivateRoute:", user, token, location);

  if (!user || token === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
