import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  Button,
  Card,
  Form,
  ListGroup,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { addToCart, removeFromCart } from "../../actions/cartActions";
import Message from "../Message";
import { BACKEND_URL } from "../../constants";

function CartScreen() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cartItems);

  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const qty = queryParams.get("qty");

  useEffect(() => {
    if (id) {
      dispatch(addToCart(id, qty));
      // console.log(cart);
    }
  }, [id, dispatch, qty]);

  async function removeFromCartHandler(id) {
    dispatch(removeFromCart(id));
  }

  async function checkoutHandler() {
    navigate("/login?redirect=shipping");
  }

  return (
    <>
      <Row className="my-3">
        <Col md={8}>
          <h1 className="my-3 py-3">Shopping Cart</h1>
          {cart.length === 0 ? (
            <Message variant="info">
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            cart.map((item) => (
              <Row key={item.product} className="my-4 py-3">
                <Col md={2}>
                  <Image
                    src={`${BACKEND_URL}/${item.image}`}
                    alt={item.name}
                    fluid
                    rounded
                  />
                </Col>
                <Col md={3}>
                  <Link to={`/product/${item.product}`}>
                    <b>{item.name}</b>
                  </Link>
                </Col>
                <Col md={2} className="my-auto">
                  <strong>${item.price}</strong>
                </Col>
                <Col md={2}>
                  <Form.Control
                    as="select"
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(addToCart(item.product, Number(e.target.value)))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
                <Col md={2}>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => removeFromCartHandler(item.product)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </Col>
                <hr className="my-4" />
              </Row>
            ))
          )}
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cart.reduce((acc, item) => acc + Number(item.qty), 0)}) items
              </h2>
              $
              {cart
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>
          <Button
            type="button"
            className="btn-block"
            disabled={cart.length === 0}
            variant={"outline-secondary"}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default CartScreen;
