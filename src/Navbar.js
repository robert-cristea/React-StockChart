import React from 'react';
import { Nav, Navbar, Container } from "react-bootstrap";

function AppNavbar() {
    return (
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
            <Navbar.Brand href="/">Stock</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/stock">Chart</Nav.Link>
                
            </Nav>
            </Navbar.Collapse>
        </Container>
     </Navbar>
    );
};

export default AppNavbar;