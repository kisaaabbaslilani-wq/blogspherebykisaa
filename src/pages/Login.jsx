import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { showToast } from "../utils/toast";
import { FaSignInAlt } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      showToast("Welcome back! 🌸");
      navigate("/");
    } catch (error) {
      showToast(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form-card fade-up" onSubmit={handleLogin}>
      <h2>Welcome back</h2>
      <p className="form-sub">Log in to continue to BlogSphere.</p>

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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-block" disabled={submitting}>
        <FaSignInAlt /> {submitting ? "Logging in…" : "Login"}
      </button>

      <p className="form-switch">
        New to BlogSphere? <Link to="/signup">Create an account</Link>
      </p>
    </form>
  );
}

export default Login;
