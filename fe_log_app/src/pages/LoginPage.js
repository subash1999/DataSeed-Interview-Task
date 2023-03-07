import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectAccessToken, setCredentials } from "../redux/slices/authSlice";
import { useLoginMutation } from "../services/authService";
import { Formik } from "formik";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short! Minimun legth is 2 characters long")
    .max(50, "Too Long! Maximum legth is 50 characters long")
    .required("Username is required"),
  password: Yup.string()
    .min(2, "Too Short! Minimun legth is 2 characters long")
    .max(50, "Too Long! Maximun legth is 50 characters long")
    .required("Password is required"),
});

const initialFormValues = {
  username: "",
  password: "",
};

const LoginPage = () => {
  const token = useSelector(selectAccessToken);
  const navigate = useNavigate();
  const location = useLocation();

  const userRef = useRef();
  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    // redirect to home if already logged in
    if (token) navigate("/");
    document.title = "Login | Log Dashboard";
    userRef.current.focus();
    setErrMsg("");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


 

  const submitLoginForm = async (username, password) => {
    try {
      const userData = await login({
        username: username,
        password: password,
      }).unwrap();
      dispatch(setCredentials({ ...userData }));
      // get return url from location state or default to home page
      const { from } = location.state || { from: { pathname: "/" } };
      navigate(from);

    } catch (err) {
      console.log(err);
      if (!err?.status) {
        // isLoading: true until timeout occurs
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg(err.data.error);
      } else if (err.status === 401) {
        setErrMsg(err.data.error);
      } else if (err.status === 404) {
        setErrMsg("Login URL not found");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "70vh" }}
    >
      <Container className="col-xl-4 col-lg-5 col-md-6 col-sm-8 p-5  border shadow">
        <h1 className="text-center">Log Dashboard</h1>
        <Container ref={errRef}>
          {errMsg && (
            <Alert
              variant="danger"
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </Alert>
          )}
        </Container>
        <Formik
          validationSchema={loginSchema}
          onSubmit={(values) =>
            submitLoginForm(values.username, values.password)
          }
          initialValues={initialFormValues}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            isSubmitting,
            touched,
            isValid,
            errors,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              {/* username */}
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  ref={userRef}
                  value={values.username}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  isInvalid={!!errors.username}
                  aria-describedby="username-message"
                />
                <Form.Control.Feedback id="username-message" type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={handleChange}
                  value={values.password}
                  disabled={isSubmitting}
                  isInvalid={!!errors.password}
                  aria-describedby="password-message"
                />
                <Form.Control.Feedback id="password-message" type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
              <br />
              <Container className="d-flex justify-content-center">
                <Button
                  variant="primary w-100"
                  type="submit"
                  name="loginBtn"
                  disabled={isSubmitting}
                >
                  LOGIN
                  {isSubmitting ? (
                    <div
                      className="spinner-border spinner-border-sm text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    ""
                  )}
                </Button>
              </Container>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  );
};

export default LoginPage;
