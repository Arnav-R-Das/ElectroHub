import "./Login.css";

function Login({ onClose, onSignup }) {
  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h1 className="title">WELCOME BACK</h1>
        <p className="subtitle">
          Sign in to access an enhanced shopping experience.
        </p>

        <div className="field">
          <label>Email</label>
          <input type="email" />
        </div>

        <div className="field">
          <label>Password</label>
          <div className="password-box">
            <input type="password" />
            <span className="eye">👁</span>
          </div>
        </div>

        <button className="signin-btn">sign in</button>

        <p className="footer-text">
          Don't have an account?{" "}
          <span className="link" onClick={onSignup}>
            Sign up.
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
