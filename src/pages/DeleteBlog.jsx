import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

function DeleteBlog({ blog, id }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    // 🔒 Confirm before delete (prevents accidental deletion)
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      // 🔒 Check login
      if (!user) {
        showToast("Please log in first");
        return;
      }

      // 🔒 Ownership check
      if (user.uid !== blog.userId) {
        showToast("You can only delete your own blog");
        return;
      }

      await deleteDoc(doc(db, "blogs", id));

      showToast("Blog deleted successfully");

      // Redirect after delete
      navigate("/blogs");
    } catch (error) {
      console.error("Delete error:", error);
      showToast("Failed to delete blog");
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
}

export default DeleteBlog;