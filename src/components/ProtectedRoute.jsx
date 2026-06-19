import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loader while checking auth state
  if (loading) {
    return <Loader />;
  }

  // If user is not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists → allow access
  return children;
};

export default ProtectedRoute;