import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import Loader from "../components/Loader";
import { formatDate, initial, readTime } from "../utils/format";
import { FaArrowLeft, FaClock } from "react-icons/fa";

function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogRef = doc(db, "blogs", id);

        const snap = await getDoc(blogRef);

        if (snap.exists()) {
          const data = snap.data();

          await updateDoc(blogRef, {
            views: increment(1),
          });

          setBlog({
            id: snap.id,
            ...data,
            views: (data.views || 0) + 1,
            likes: data.likes || 0,
          });

        } else {
          setBlog(null);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);


  const handleLike = async () => {
    try {
      await updateDoc(doc(db, "blogs", id), {
        likes: increment(1),
      });

      setBlog((prev) => ({
        ...prev,
        likes: (prev.likes || 0) + 1,
      }));

    } catch (error) {
      console.error(error);
    }
  };


  if (loading) {
    return <Loader text="Loading blog..." />;
  }


  if (!blog) {
    return (
      <div className="empty">
        <div className="empty-icon">🔍</div>

        <h3>Blog not found</h3>

        <p>
          This post may have been removed or the link is incorrect.
        </p>

        <Link to="/blogs" className="btn">
          Back to Blogs
        </Link>
      </div>
    );
  }


  const image = blog.imageUrl || blog.coverImage;


  return (
    <article className="blog-details fade-up">

      <Link to="/blogs" className="back-link">
        <FaArrowLeft /> Back to Blogs
      </Link>


      {image && (
        <img
          src={image}
          alt={blog.title}
          className="detail-img"
        />
      )}


      <h1>{blog.title}</h1>


      <div className="detail-meta">

        <div className="avatar">
          {initial(blog.author)}
        </div>


        <div className="who">

          <span className="name">
            {blog.author || "Anonymous"}
          </span>


          <span className="date">

            {formatDate(blog.createdAt)}


            {blog.content && (
              <>
                {" • "}
                <FaClock style={{ verticalAlign: "-1px" }} />
                {" "}
                {readTime(blog.content)} min read
              </>
            )}

          </span>

        </div>

      </div>


      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >

        <span>
          👁️ {blog.views || 0}
        </span>


        <button
          onClick={handleLike}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ❤️ {blog.likes || 0}
        </button>

      </div>


      <div
        className="blog-body"
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />

    </article>
  );
}

export default BlogDetails;