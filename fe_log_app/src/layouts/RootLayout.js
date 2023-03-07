import React from "react";
import { Form, Button, Container } from "react-bootstrap";

import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return <Outlet />;
};

export default RootLayout;
