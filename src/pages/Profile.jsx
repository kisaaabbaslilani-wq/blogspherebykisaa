import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../context/useAuth";
import { db } from "../firebase/firebaseConfig";
import { initial } from "../utils/format";
import { FaPenNib, FaSignOutAlt, FaStar, FaSignInAlt } from "react-icons/fa";

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
      <div className="empty">
        <div className="empty-icon">🔒</div>
        <h3>Please log in</h3>
        <p>Log in to view your profile and stats.</p>
        <Link to="/login" className="btn">
          <FaSignInAlt /> Login
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card fade-up">
        <div className="profile-banner" />

        <div className="profile-head">
          <div className="profile-avatar">{initial(user.email)}</div>
          <h2>{user.email.split("@")[0]}</h2>
          <p className="email">{user.email}</p>
          <span className="badge">
            <FaStar /> Active Writer
          </span>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <div className="num">{blogCount}</div>
            <div className="label">Blogs published</div>
          </div>
          <div className="stat">
            <div className="num">∞</div>
            <div className="label">Ideas to share</div>
          </div>
        </div>

        <div className="profile-foot">
          <Link to="/create-blog" className="btn">
            <FaPenNib /> Write a Blog
          </Link>
          <button className="btn-ghost" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
