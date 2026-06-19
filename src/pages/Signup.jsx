import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { showToast } from "../utils/toast";
import { FaUserPlus } from "react-icons/fa";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters");
      return;
    }

    try {
      setSubmitting(true);
      await signup(email, password);
      showToast("Account created! 🎉");
      navigate("/");
    } catch (error) {
      showToast(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card fade-up" onSubmit={handleSignup}>
      <h2>Create account</h2>
      <p className="form-sub">Join BlogSphere and start writing today.</p>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-block" disabled={submitting}>
        <FaUserPlus /> {submitting ? "Creating…" : "Sign up"}
      </button>

      <p className="form-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  );
}

export default Signup;
