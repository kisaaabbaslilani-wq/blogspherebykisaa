import { Link } from "react-router-dom";
import { FaFeatherAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <FaFeatherAlt />
          </span>
          Blog<span>Sphere</span>
        </Link>

        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/create-blog">Write</Link>
        </nav>

        <p>© {new Date().getFullYear()} BlogSphere · by Kisaa Zehra</p>
      </div>
    </footer>
  );
}

export default Footer;
