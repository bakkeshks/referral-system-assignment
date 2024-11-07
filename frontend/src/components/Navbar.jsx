// create reac bootstrap navbar component
import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" className="fixed-top">
      <Container>
        <Navbar.Brand href="#home">Referral System</Navbar.Brand>
        <Nav className="ms-auto gap-3">
          <Nav.Link href="/register">Register</Nav.Link>
          <Nav.Link href="/signin">SignIn</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
