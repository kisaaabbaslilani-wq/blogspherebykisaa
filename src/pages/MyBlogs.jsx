import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import { FaPenNib, FaSignInAlt } from "react-icons/fa";

function MyBlogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "blogs"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs
.map((doc) => {
  const d = doc.data();

  return {
    id: doc.id,
    ...d,
    likes: d.likes ?? 0,
    views: d.views ?? 0,
  };
})          .sort(
            (a, b) =>
              (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          );
        setBlogs(data);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [user]);

  if (!user) {
    return (
      <div className="empty">
        <div className="empty-icon">🔒</div>
        <h3>Please log in</h3>
        <p>Log in to view and manage the blogs you've written.</p>
        <Link to="/login" className="btn">
          <FaSignInAlt /> Login
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="section-head">
        <h2>
          My <span>Blogs</span>
        </h2>
        <p>Everything you've published, all in one place.</p>
      </header>

      {loading ? (
        <Loader text="Loading your blogs..." />
      ) : blogs.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">✍️</div>
          <h3>No blogs yet</h3>
          <p>You haven't written anything yet — your first story awaits.</p>
          <Link to="/create-blog" className="btn">
            <FaPenNib /> Write your first blog
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

export default MyBlogs;
