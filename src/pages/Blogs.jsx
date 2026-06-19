import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import BlogCard from "../components/BlogCard";
import { FaPenNib } from "react-icons/fa";

function BlogSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="sk sk-avatar" />
      <div className="sk sk-title" />
      <div className="sk sk-line" />
      <div className="sk sk-line" style={{ width: "85%" }} />
      <div className="sk sk-line" style={{ width: "60%" }} />
    </div>
  );
}

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="page">
      <header className="section-head">
        <h2>
          Explore <span>Blogs</span>
        </h2>
        <p>Fresh stories from the BlogSphere community.</p>
      </header>

      {loading ? (
        <div className="blog-container">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📝</div>
          <h3>No blogs yet</h3>
          <p>Be the first to share a story with the community.</p>
          <Link to="/create-blog" className="btn">
            <FaPenNib /> Write a Blog
          </Link>
        </div>
      ) : (
        <div className="blog-container">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onDeleted={(id) =>
                setBlogs((prev) => prev.filter((b) => b.id !== id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Blogs;
