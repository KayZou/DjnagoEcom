import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Row, ListGroup, Card, Image } from "react-bootstrap";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../../actions/orderActions";
import Loader from "../Loader";
import Message from "../Message";
import {
  BACKEND_URL,
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../../constants";

function OrderScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(false);

  const { order, error, loading } = useSelector((state) => state.orderDetails);

  const { loading: loadingPay, success: successPay } = useSelector(
    (state) => state.orderPay
  );

  const { loading: loadingDeliver, success: successDeliver } = useSelector(
    (state) => state.orderDeliver
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  useEffect(() => {
    if(!userInfo){
      navigate('/login')
    }
    if (!order || order._id !== Number(id) || refresh || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(id));
      setRefresh(false);
    }
  }, [successPay, dispatch, order, id, refresh, successDeliver, navigate, userInfo]);

  async function handlePayment(e, paymentResult) {
    e.preventDefault();
    setRefresh(true);
    dispatch(payOrder(id, paymentResult));
  }

  async function deliverHandler() {
    dispatch(deliverOrder(order));
    setRefresh(true);
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"} className="mt-3">
          {error}
        </Message>
      ) : (
        <div>
          <h1 className="my-3">Order {order._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Address:</strong> {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode},{" "}
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on{" "}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">
                      Paid on {new Date(order.paidAt).toLocaleDateString()}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message variant={"info"}>Your order is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={3}>
                              <Image
                                src={BACKEND_URL + item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col>
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </Col>
                            <Col md={4}>
                              {item.qty} x ${item.price} = $
                              {item.qty * item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <h2>Order Summary</h2>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Items</Col>
                      <Col>${order.itemsPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${order.shippingPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${order.taxPrice} (20% TVA)</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>${order.totalPrice}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <>
                      {message && (
                        <ListGroup.Item>
                          <Message variant="info">{message}</Message>
                        </ListGroup.Item>
                      )}
                      <ListGroup.Item className="d-flex justify-content-center">
                        {loadingPay ? (
                          <Loader />
                        ) : (
                          <Button
                            type="button"
                            className="btn btn-block"
                            variant="outline-secondary"
                            disabled={order.orderItems.length === 0}
                            onClick={handlePayment}
                          >
                            <i className="fas fa-money-bill-wave"></i> Pay
                          </Button>
                        )}
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item className="d-flex justify-content-center">
                      {loadingDeliver && <Loader />}
                      <Button
                        type="button"
                        className="btn btn-block"
                        variant="outline-secondary"
                        onClick={deliverHandler}
                      >
                        <i className="fas fa-truck"></i> Mark as Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default OrderScreen;
