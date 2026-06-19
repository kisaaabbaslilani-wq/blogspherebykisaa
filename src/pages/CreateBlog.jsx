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
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Please log in to publish");
      navigate("/login");
      return;
    }
    if (!title.trim() || !stripHtml(content) || !author.trim()) {
      showToast("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "blogs"), {
        title: title.trim(),
        content: content,
        author: author.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      showToast("Blog published successfully! 🎉");
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      showToast("Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card wide fade-up" onSubmit={handleSubmit}>
      <h2>Write a Blog</h2>
      <p className="form-sub">Share your story with the BlogSphere community.</p>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          placeholder="An eye-catching title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="author">Author name</label>
        <input
          id="author"
          type="text"
          placeholder="How you'd like to be credited"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
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

      <button type="submit" className="btn-block" disabled={submitting}>
        <FaPenNib /> {submitting ? "Publishing…" : "Publish Blog"}
      </button>
    </form>
  );
}

export default CreateBlog;
