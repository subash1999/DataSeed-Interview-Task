import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Card,
  Col,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import LogSourceModalForm from "../components/LogSourceModalForm";

const LogSourcePage = () => {
  useEffect(() => {
    document.title = "Log Sources | Log Dashboard";
  }, []);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  return (
    <>
      <h2>Log Sources</h2>
      <Container className="d-flex justify-content-end">
        <Button variant="primary" onClick={handleShowModal}>
          Add Source
        </Button>
      </Container>

      <LogSourceModalForm show={showModal} onHide={handleCloseModal} />
    </>
  );
};

export default LogSourcePage;
