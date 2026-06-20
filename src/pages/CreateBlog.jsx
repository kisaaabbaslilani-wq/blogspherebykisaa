import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import { showToast } from "../utils/toast";
import { stripHtml } from "../utils/format";
import RichTextEditor from "../components/RichTextEditor";
import { FaPenNib } from "react-icons/fa";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // 🔥 NEW
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const CONTENT_LIMIT = 5000;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const plainContent = stripHtml(content);

    if (!user) {
      showToast("Please log in to publish 🔐");
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      showToast("Please enter a blog title ✍️");
      return;
    }

    if (!author.trim()) {
      showToast("Please enter your author name 👤");
      return;
    }

    if (!plainContent.trim()) {
      showToast("Your blog content cannot be empty 📝");
      return;
    }

    if (plainContent.length < 50) {
      showToast("Content should be at least 50 characters 📚");
      return;
    }

    if (plainContent.length > CONTENT_LIMIT) {
      showToast(`Content cannot exceed ${CONTENT_LIMIT} characters`);
      return;
    }

    try {
      setSubmitting(true);

      const docRef = await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        author: author.trim(),
        content,
        imageUrl: imageUrl.trim(), // 🔥 SAVE LINK
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      showToast("Blog published successfully! 🎉");
      navigate("/blogs");

    } catch (error) {
      console.error(error);
      showToast(error.message || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card wide fade-up" onSubmit={handleSubmit}>
      <h2>Write a Blog</h2>

      <div className="field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label>Author Name</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      {/* 🔥 NEW IMAGE URL FIELD */}
      <div className="field">
        <label>Image URL (optional)</label>
        <input
          type="text"
          placeholder="Paste image link here..."
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="field">
        <label>Content</label>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write your blog here..."
        />
      </div>

      <button type="submit" className="btn-block" disabled={submitting}>
        {submitting ? "⏳ Publishing..." : <><FaPenNib /> Publish Blog</>}
      </button>
    </form>
  );
}

export default CreateBlog;