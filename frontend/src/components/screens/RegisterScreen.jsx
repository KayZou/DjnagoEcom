import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Message";
import Loader from "../Loader";
import { register } from "../../actions/userActions";
import FormContainer from "../FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";

function RegisterScreen() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(window.location.search);
  const redirect = queryParams.get("redirect")
    ? queryParams.get("redirect")
    : "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { error, loading, userInfo } = useSelector(
    (state) => state.userRegister
  );

  async function handleRegister(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
      navigate(redirect);
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {message && <Message variant="danger">{message}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleRegister}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label className="my-3">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="my-3">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label className="my-3">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="outline-secondary" className="my-3">
          Register
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}

export default RegisterScreen;
