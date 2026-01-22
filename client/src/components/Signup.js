import "./Signup.css";

function Signup({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h1 className="title">CREATE ACCOUNT</h1>
        <p className="subtitle">
          Join us to enjoy a personalized shopping experience.
        </p>

        <div className="field">
          <label>Full Name</label>
          <input type="text" />
        </div>

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

        <button className="signin-btn">create account</button>
      </div>
    </div>
  );
}

export default Signup;
