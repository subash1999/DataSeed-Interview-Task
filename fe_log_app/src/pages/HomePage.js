import React, { useEffect } from "react";
import { Form, Button, Container , Row, Card, Col} from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    document.title = "Home | Log Dashboard";
  }, []);
  return (
    <h1>TEST</h1>
  );
};

export default HomePage;
