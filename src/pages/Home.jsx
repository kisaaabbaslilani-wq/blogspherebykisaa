import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to BlogSphere by Kisaa Zehra</h1>

      <p className="home-text">
        A simple platform to create, read, and manage your blogs.
      </p>

      <div className="home-actions">
        <Link to="/blogs">
          <button>Explore Blogs</button>
        </Link>

        <Link to="/create-blog">
          <button>Create Blog</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;