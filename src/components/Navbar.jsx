import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  FaHome,
  FaBook,
  FaPenNib,
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaFeatherAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      close();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">
            <FaFeatherAlt />
          </span>
          Blog<span>Sphere</span>
        </Link>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>
            <FaHome /> Home
          </NavLink>

          <NavLink to="/blogs" onClick={close}>
            <FaBook /> Blogs
          </NavLink>

          {user ? (
            <>
              <NavLink to="/create-blog" onClick={close}>
                <FaPenNib /> Write
              </NavLink>

              <NavLink to="/my-blogs" onClick={close}>
                <FaBook /> My Blogs
              </NavLink>

              <NavLink to="/profile" onClick={close}>
                <FaUser /> Profile
              </NavLink>

              <button onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={close} className="btn btn-sm">
              <FaSignInAlt /> Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
