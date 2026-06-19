import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  FaFeatherAlt,
  FaPenNib,
  FaBookOpen,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";

function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-inner fade-up">
          <span className="eyebrow">
            <FaFeatherAlt /> Your stories, beautifully kept
          </span>

          <h1>
            Write, share &amp; manage <br />
            your blogs on <span className="grad">BlogSphere</span>
          </h1>

          <p>
            A clean, modern space to publish your thoughts, browse what others
            are writing, and keep every post organized in one place.
          </p>

          <div className="hero-actions">
            <Link to="/blogs" className="btn">
              <FaBookOpen /> Explore Blogs
            </Link>
            <Link
              to={user ? "/create-blog" : "/login"}
              className="btn btn-ghost"
            >
              {user ? "Write a Blog" : "Get Started"} <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <div className="feature-icon">
            <FaPenNib />
          </div>
          <h3>Create with ease</h3>
          <p>Draft and publish a blog in seconds with a distraction-free editor.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <FaBookOpen />
          </div>
          <h3>Discover stories</h3>
          <p>Browse posts from every writer in a clean, responsive feed.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">
            <FaUserShield />
          </div>
          <h3>Full control</h3>
          <p>Edit or delete your own posts anytime — only you manage your work.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
