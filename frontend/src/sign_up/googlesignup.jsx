import React, { useState } from 'react';  
import { auth, GoogleAuthProvider, signInWithPopup } from '../../firebase';  
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import "./signup.css";
import googleIcon from './google.jpg';  

const GoogleLoginButton = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();  // Initialize navigate

  const handleLogin = async () => {
    try {
      console.log("Google Sign-In Initiated...");  // Debugging

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Firebase Sign-In Successful!", result);  // Debugging

      const token = await result.user.getIdToken();

      // Send token to backend
      const response = await fetch('/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);  // Debugging

      if (data.message) {
        setUser(data.user);
        console.log("Navigating to /home...");
        navigate('/homepage');  // Redirect after login
      } else {
        console.error("Login failed: No success message from backend.");
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button className="google-login-btn" onClick={handleLogin}>
      <img src={googleIcon} alt="Google" />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
