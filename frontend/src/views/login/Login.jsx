import { React, useState } from "react";
import axios from 'axios';
import "./LoginStyle.css"
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:80/api/login', { username, password });
      if (response.status === 200) {
        console.log(response);
        localStorage.setItem("jwtToken", response.data.token);
        navigate("/home");
      }
    } catch (error) {
      console.error('Login failed', error.response.data);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div className="login-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="login-input-box">
            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username or Email" required />
            <FaUser className="login-icon" />
          </div>
          <div className="login-input-box">
            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" required />
            <FaLock className="login-icon" />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me!
            </label>
            <a href="/">Forgot Password or Username?</a>
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login