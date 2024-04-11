import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Message";
import Loader from "../Loader";
import { listUsers, deleteUser } from "../../actions/userActions";

function UserListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, error, loading } = useSelector((state) => state.userList);

  const {userInfo, error: errorLogin} = useSelector((state) => state.userLogin);

  const { success: successDelete } = useSelector((state) => state.userDelete);

  useEffect(() => {
    if(!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    }
    dispatch(listUsers());
  }, [dispatch, navigate, userInfo, successDelete]);

  async function deleteHandler(id) {
    if (window.confirm("Are you sure?")) {
    dispatch(deleteUser(id));
    }
  }

  return (
    <div>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Link>
                      <i className="fas fa-edit"></i>
                    </Link>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm ms-2 p-0 border-0 bg-transparent text-danger" 
                    onClick={() => {deleteHandler(user._id)}}
                  >
                    <i className="fa-solid fa-trash fa-lg"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default UserListScreen;
