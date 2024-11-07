import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  return (
    <div
      className="landing-page"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "250%",
      }}
    >
      <style>
        {`
          .hero-section {
            background-color: #333; /* Primary color */
            color: white;
            padding: 60px;
            margin-top: -150px;
            margin-right: -110px;
            text-align: center;
          }
           
        .button{
        margin-top: 30px;
        }
        `}
      </style>
      <div className="hero-section">
        <h1>Welcome to Referral System</h1>
        <p>Get Rewarded for Your Referrals.</p>
        <Button variant="light" size="lg" className="button">
          <Link to="/register">Get Started </Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
