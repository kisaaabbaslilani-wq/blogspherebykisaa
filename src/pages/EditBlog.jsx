import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { showToast } from "../utils/toast";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const ref = doc(db, "blogs", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // 🔒 Ownership check
          if (data.userId !== user.uid) {
            showToast("You are not allowed to edit this blog");
            navigate("/blogs");
            return;
          }

          setTitle(data.title);
          setContent(data.content);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBlog();
  }, [id, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      showToast("Fields cannot be empty");
      return;
    }

    await updateDoc(doc(db, "blogs", id), {
      title,
      content,
    });

    showToast("Blog updated!");
    navigate(`/blog/${id}`);
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <form onSubmit={handleUpdate}>
      <h2>Edit Blog</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">Update</button>
    </form>
  );
}

export default EditBlog;