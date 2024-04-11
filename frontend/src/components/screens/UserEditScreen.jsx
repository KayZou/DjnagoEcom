import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import Loader from "../Loader";
import Message from "../Message";
import FormContainer from "../FormContainer";
import { getUserById, updateUser } from "../../actions/userActions";

function UserEditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, user } = useSelector((state) => state.userInfo);

  const { success } = useSelector((state) => state.userUpdate);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user || user._id !== Number(id)) {
      dispatch(getUserById(id));
    } else {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [dispatch, user, id, success]);

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(updateUser({ id, name, email, isAdmin }));
    navigate("/admin/userlist");
  }

  return (
    <>
      <Link
        to="/admin/userlist"
        className=" btn btn-sm btn-outline-secondary my-3 ms-2 me-2"
      >
        <i className="fa-solid fa-arrow-left me-2"></i>Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-3"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-3"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="isadmin">
            <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="my-3"
            ></Form.Check>
          </Form.Group>
          <Button type="submit" variant="outline-secondary" className="my-3">
            <i className="fa-solid fa-user-pen me-2"></i>Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
}

export default UserEditScreen;
