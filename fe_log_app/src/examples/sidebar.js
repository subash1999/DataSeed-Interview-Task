import { Col, Container, Row } from "react-bootstrap";

import React, { useState } from "react";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

const DashboardLayout = () => {
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="sidebar" onClick={handleCollapse} />
      <Navbar.Brand href="#home">React Bootstrap Sidebar</Navbar.Brand>
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Container fluid>
      <Row>
        {!isCollapsed && (
          <Col sm={3} md={2} className="bg-light sidebar">
            <Nav className="flex-column">
              <Nav.Link href="#">Link 1</Nav.Link>
              <Nav.Link href="#">Link 2</Nav.Link>
              <Nav.Link href="#">Link 3</Nav.Link>
            </Nav>
          </Col>
        )}
        <Col sm={9} md={10} className="ml-sm-auto px-4">
          <h1>Main Content Area</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </Col>
      </Row>
    </Container>
  </>
  );
};

export default DashboardLayout;
