import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/auth/login", { email, password });
      if (response.data.requires2FA) {
        setRequires2FA(true);
        setUserId(response.data.userId);
      } else {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/two-factor/verify", { userId, token });
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      console.error("2FA verification failed", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {!requires2FA ? (
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handle2FAVerification}>
          <input type="text" placeholder="2FA Code" value={token} onChange={(e) => setToken(e.target.value)} required />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
};

export default Login;