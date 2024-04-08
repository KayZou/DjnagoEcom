import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateUserProfile } from "../../actions/userActions";
import Message from "../Message";
import Loader from "../Loader";
import { UPDATE_PROFILE_RESET } from "../../constants";

function ProfileScreen() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { error, loading, user } = useSelector((state) => state.userDetails);

  const { userInfo } = useSelector((state) => state.userLogin);

  const { success } = useSelector((state) => state.userUpdateProfile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: UPDATE_PROFILE_RESET });
        dispatch(getUserDetails("profile"));
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, user, dispatch, navigate, success]);

  async function submitHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
      setMessage("");
    }
  }

  return (
    <>
      <Row>
        <Col md={3}>
          <h1 className="my-3">Profile</h1>
          {error && <Message variant="danger">{error}</Message>}
          {message && <Message variant="danger">{message}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
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
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label className="my-3">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="outline-secondary" className="my-3">
              Update
            </Button>
          </Form>
        </Col>
        <Col md={9}>
          <h2 className="my-3">My Orders</h2>
        </Col>
      </Row>
    </>
  );
}

export default ProfileScreen;
