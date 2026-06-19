import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import { showToast } from "../utils/toast";
import { stripHtml } from "../utils/format";
import Loader from "../components/Loader";
import RichTextEditor from "../components/RichTextEditor";
import { FaSave } from "react-icons/fa";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const ref = doc(db, "blogs", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          // Ownership check
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
  }, [id, user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim() || !stripHtml(content)) {
      showToast("Fields cannot be empty");
      return;
    }

    try {
      setSaving(true);
      await updateDoc(doc(db, "blogs", id), {
        title: title.trim(),
        content: content,
      });
      showToast("Blog updated! ✨");
      navigate(`/blog/${id}`);
    } catch (error) {
      console.log(error);
      showToast("Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading editor..." />;

  return (
    <form className="form-card wide fade-up" onSubmit={handleUpdate}>
      <h2>Edit Blog</h2>
      <p className="form-sub">Make your changes and save when you're ready.</p>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="content">Content</label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your blog here..."
        />
      </div>

      <div className="modal-buttons" style={{ justifyContent: "stretch" }}>
        <button
          type="button"
          className="btn-ghost btn-block"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          Cancel
        </button>
        <button type="submit" className="btn-block" disabled={saving}>
          <FaSave /> {saving ? "Saving…" : "Update"}
        </button>
      </div>
    </form>
  );
}

export default EditBlog;
