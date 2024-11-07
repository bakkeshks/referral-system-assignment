import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "../components/Navbar";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const data = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "https://referral-system-assignment.onrender.com/auth/login",
        data
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Redirect to /dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in failed:", error);
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
          maxWidth: "600px",
          margin: "200px",
          marginLeft: "750px",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Sign In</h2>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mt-3">
            {success}
          </Alert>
        )}
      </div>
    </>
  );
};

export default SignInForm;
