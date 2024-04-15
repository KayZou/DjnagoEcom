import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../constants";
import Message from "../Message";
import Loader from "../Loader";

function ProductListScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading, error } = useSelector(
    (state) => state.productList
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    error: errorDelete,
    loading: loadingDelete,
    success,
  } = useSelector((state) => state.productDelete);

  const {
    error: errorCreate,
    loading: loadingCreate,
    success: successCreate,
    product,
  } = useSelector((state) => state.productCreate);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!userInfo.isAdmin) {
      navigate("/login");
    }
    if (successCreate) {
      navigate(`/admin/product/${product._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, userInfo, navigate, success, successCreate]);

  async function deleteHandler(id) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  }

  async function createProductHandler() {
    dispatch(createProduct());
  }

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-end">
          <Button
            className="my-3"
            variant="outline-secondary"
            onClick={createProductHandler}
          >
            <i className="fas fa-plus me-2"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}
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
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Link to={`/admin/product/${product._id}/edit`}>
                    <i className="fas fa-edit"></i>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm ms-2 p-0 border-0 bg-transparent text-danger"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fa-solid fa-trash fa-lg"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

export default ProductListScreen;
