import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import BlogCard from "../components/BlogCard";

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

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBlogs(data);
      } catch (error) {
        console.log("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [user]);

  if (!user) return <p className="empty">Please login first</p>;

  if (loading) return <p className="loading">Loading your blogs...</p>;

  if (blogs.length === 0)
    return <p className="empty">You haven't created any blogs yet</p>;

  return (
    <div>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        My Blogs
      </h2>

      <div className="blog-container">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}

export default MyBlogs;