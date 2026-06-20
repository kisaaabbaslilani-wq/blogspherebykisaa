import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
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
        const snap = await getDoc(doc(db, "blogs", id));

        if (snap.exists()) {
          setBlog({
            id: snap.id,
            ...snap.data(),
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

  if (loading) return <Loader text="Loading blog..." />;

  if (!blog) {
    return (
      <div className="empty">
        <div className="empty-icon">🔍</div>
        <h3>Blog not found</h3>
        <p>This post may have been removed or the link is incorrect.</p>

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
        className="blog-body"
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
    </article>
  );
}

export default BlogDetails;