import { React, useState } from "react";
import axios from 'axios';
import "./LoginStyle.css"
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    let timerInterval;
    const swalInstance = Swal.fire({
      title: "Please confirm using mobile application!",
      html: "I will close in <b></b> minutes and seconds.",
      timer: 120000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          const timeLeft = Swal.getTimerLeft();
          const minutes = Math.floor(timeLeft / 60000);
          const seconds = Math.floor((timeLeft % 60000) / 1000);
          timer.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        Swal.fire({
          title: "Login failed.",
          text: "Please try again",
          icon: "error"
        });
      }
    });
  
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      if (response.status === 200) {
        localStorage.setItem("jwtToken", Object.keys(response.data.token));
        localStorage.setItem("lastLogin", Object.values(response.data.token));
        localStorage.setItem("userId", response.data.user.id);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        Swal.close();
        navigate("/ibanking");
      }
      else {
        Swal.close();
        Swal.fire({
          title: "Login failed.",
          text: "Username or password are incorect",
          icon: "error"
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: "Login failed.",
        text: "Username and password doesn't match. Please try again.",
        icon: "error"
      });
      console.error('Login failed', error?.response.data);
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