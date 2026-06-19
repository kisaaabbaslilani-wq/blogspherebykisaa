import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast("Login required");
      return;
    }

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        content,
        author,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      showToast("Blog created successfully!");
      navigate("/blogs");
    } catch (error) {
      console.log(error);
      showToast("Failed to create blog");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Blog</h2>

      <input
        type="text"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Author name"
        onChange={(e) => setAuthor(e.target.value)}
      />

      <textarea
        placeholder="Write your blog..."
        onChange={(e) => setContent(e.target.value)}
      />

      <button type="submit">Publish</button>
    </form>
  );
}

export default CreateBlog;