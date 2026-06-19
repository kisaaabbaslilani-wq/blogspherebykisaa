import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    const fetchBlogCount = async () => {
      if (!user) return;

      const q = query(
        collection(db, "blogs"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      setBlogCount(snapshot.size);
    };

    fetchBlogCount();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>👤 Profile</h2>
        <p>Please login first.</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>🌸 My Profile</h2>

      <div className="profile-info">
        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Blogs Created:</strong> {blogCount}
        </p>

        <p>
          <strong>Status:</strong> Active Writer ✨
        </p>
      </div>

      <button
        style={{ marginTop: "20px" }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;