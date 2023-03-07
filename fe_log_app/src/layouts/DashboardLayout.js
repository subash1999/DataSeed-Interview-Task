import React from "react";
import { Container } from "react-bootstrap";

import { Outlet } from "react-router-dom";


import DashboardNavbar from "../components/DashboardNavbar";
const DashboardLayout = () => {
  return (
    <>
      <DashboardNavbar />
      <Container className="mt-3">
        <Outlet />
      </Container>
    </>
  );
};

export default DashboardLayout;
