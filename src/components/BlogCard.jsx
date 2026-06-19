import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { showToast } from "../utils/toast";

function BlogCard({ blog }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      if (!user) {
        showToast("Please login first");
        return;
      }

      if (user.uid !== blog.userId) {
        showToast("You can only delete your own blog");
        return;
      }

      await deleteDoc(doc(db, "blogs", blog.id));

      showToast("Blog deleted successfully");

      navigate(0);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete blog");
    }
  };

  return (
    <div className="blog-card">
      <h3>{blog.title}</h3>

      <p className="blog-author">
        By: {blog.author}
      </p>

      <p className="blog-preview">
        {blog.content?.slice(0, 100)}...
      </p>

      <Link to={`/blog/${blog.id}`}>
        Read More
      </Link>

      {user?.uid === blog.userId && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <Link to={`/edit-blog/${blog.id}`}>
            <button>Edit</button>
          </Link>

          <button
            className="danger"
            onClick={() => setShowConfirm(true)}
          >
            Delete
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Blog?</h3>

            <p>
              Are you sure you want to delete this blog?
            </p>

            <div className="modal-buttons">
              <button
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogCard;