import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Navbar from "../components/Navbar";
import axios from "axios";
const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [referralCodeGenerated, setReferralCodeGenerated] = useState(null);

  const validateForm = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

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

    if (!usernameRegex.test(username)) {
      setError(
        "Username must be between 3 and 16 characters long, and can only contain letters, numbers, and underscores"
      );
      return false;
    }

    if (referralCode && referralCode.length !== 6) {
      setError("Referral code must be 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    const data = {
      username,
      email,
      password,
      referralCode: referralCode.trim() === "" ? "" : referralCode,
    };
    try {
      const response = await axios.post(
        "https://referral-system-assignment.onrender.com/auth/register",
        data
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setReferralCodeGenerated(response.data.referralCode);
        setError(null);
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container mt-5"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          maxWidth: "600px",
          margin: "600px",
        }}
      >
        <Form onSubmit={handleSubmit}>
          <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
            Register
          </h2>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="referralCode">
            <Form.Label>Referral Code</Form.Label>
            <Form.Control
              type="text"
              value={referralCode}
              onChange={(event) => setReferralCode(event.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Register
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
            <p>Referral Code: {referralCodeGenerated}</p>
          </Alert>
        )}
      </div>
    </>
  );
};

export default RegisterForm;
