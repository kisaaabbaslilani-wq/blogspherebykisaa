import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { showToast } from "../utils/toast";
import { formatDate, initial, stripHtml } from "../utils/format";
import {
  FaArrowRight,
  FaPen,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

function BlogCard({ blog, onDeleted }) {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user?.uid === blog.userId;
  const preview = stripHtml(blog.content);

  const handleDelete = async () => {
    if (!isOwner) {
      showToast("You can only delete your own blog");
      return;
    }

    try {
      setDeleting(true);
      await deleteDoc(doc(db, "blogs", blog.id));
      showToast("Blog deleted successfully");
      setShowConfirm(false);
      if (onDeleted) onDeleted(blog.id);
    } catch (error) {
      console.error(error);
      showToast("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="blog-card fade-up">
      <div className="card-meta">
        <div className="avatar">{initial(blog.author)}</div>
        <div className="who">
          <span className="name">{blog.author || "Anonymous"}</span>
          <span className="date">{formatDate(blog.createdAt)}</span>
        </div>
      </div>

      <h3>{blog.title}</h3>

      <p className="blog-preview">
        {preview.slice(0, 120)}
        {preview.length > 120 ? "…" : ""}
      </p>

      <div className="card-footer">
        <Link to={`/blog/${blog.id}`} className="read-more">
          Read more <FaArrowRight />
        </Link>

        {isOwner && (
          <div className="card-actions">
            <Link
              to={`/edit-blog/${blog.id}`}
              className="icon-btn"
              aria-label="Edit blog"
              title="Edit"
            >
              <FaPen />
            </Link>
            <button
              className="icon-btn danger"
              aria-label="Delete blog"
              title="Delete"
              onClick={() => setShowConfirm(true)}
            >
              <FaTrashAlt />
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <FaExclamationTriangle />
            </div>
            <h3>Delete this blog?</h3>
            <p>This action can’t be undone. Your post will be permanently removed.</p>
            <div className="modal-buttons">
              <button
                className="btn-ghost"
                onClick={() => setShowConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default BlogCard;
