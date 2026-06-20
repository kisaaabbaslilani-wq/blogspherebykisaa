import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { FaExclamationTriangle } from "react-icons/fa";

function DeleteBlog({ blog, id }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      if (!user) {
        showToast("Please log in first");
        return;
      }

      if (user.uid !== blog.userId) {
        showToast("You can only delete your own blog");
        return;
      }

      await deleteDoc(doc(db, "blogs", id));

      showToast("Blog deleted successfully");

      setOpen(false);
      navigate("/blogs");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BUTTON */}
      <button className="danger" onClick={() => setOpen(true)}>
        Delete
      </button>

      {/* MODAL */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <FaExclamationTriangle />
            </div>

            <h3>Delete this blog?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-buttons">
              <button
                className="btn-ghost"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteBlog;