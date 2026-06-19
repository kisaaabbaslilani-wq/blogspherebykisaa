import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const snap = await getDoc(doc(db, "blogs", id));
      setBlog(snap.data());
    };

    fetchBlog();
  }, [id]);

  if (!blog) return <p>Loading...</p>;

  return (
    <div className="blog-details">
      
      {blog.imageUrl && (
        <img src={blog.imageUrl} className="detail-img" />
      )}

      <h2>{blog.title}</h2>

      <p className="blog-author">By: {blog.author}</p>

      <p>{blog.content}</p>
    </div>
  );
}

export default BlogDetails;