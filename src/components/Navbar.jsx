import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  FaHome,
  FaBook,
  FaPlusCircle,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <Link to="/">
        <FaHome />
        Home
      </Link>

      <Link to="/blogs">
        <FaBook />
        Blogs
      </Link>

      {user ? (
        <>
          <Link to="/create-blog">
            <FaPlusCircle />
            Create Blog
          </Link>

          <Link to="/my-blogs">
            <FaBook />
            My Blogs
          </Link>

          <Link to="/profile">
            <FaUser />
            Profile
          </Link>

          <button onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <FaSignInAlt />
            Login
          </Link>

          <Link to="/signup">
            <FaUserPlus />
            Signup
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;