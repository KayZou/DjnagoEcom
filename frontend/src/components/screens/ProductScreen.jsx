import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  listProductDetails,
  createProductReview,
} from "../../actions/productActions";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../Rating";
import Message from "../Message";
import Loader from "../Loader";
// import products from "../../products";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL, PRODUCT_CREATE_REVIEW_RESET } from "../../constants";

function ProductScreen() {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const {
    success: successProductReview,
    error: errorProductReview,
    loading: loadingProductReview,
  } = useSelector((state) => state.createProductReview);

  const { userInfo } = useSelector((state) => state.userLogin);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [id, successProductReview, dispatch]);

  async function handleClick() {
    navigate(`/cart/${id}?qty=${qty}`);
  }

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <div className="my-3 p-3 rounded">
        <Link to={"/"} className="align-items-center">
          <i className="fa-solid fa-arrow-left mr-4"></i> <span>Go Back</span>
        </Link>
      </div>
      <Row>
        <Col md={6}>
          <Image src={BACKEND_URL + product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              Price: <strong>${product.price}</strong>{" "}
            </ListGroup.Item>
            <ListGroup.Item>
              Description: <strong>{product.description}</strong>{" "}
            </ListGroup.Item>
            <ListGroup.Item>
              <Col>
                Status:{" "}
                <strong>
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </strong>
              </Col>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>
                      {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col className="my-3">Quantity:</Col>
                    <Col xs="auto" className="my-1">
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="d-flex justify-content-center">
                <Button
                  type="button"
                  disabled={product.countInStock === 0}
                  variant="outline-secondary"
                  onClick={handleClick}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h2>Write a Customer Review</h2>
              {loadingProductReview && <Loader />}
              {successProductReview && (
                <Message variant="success">Review Submitted</Message>
              )}{" "}
              {errorProductReview && (
                <Message variant="danger">{errorProductReview}</Message>
              )}
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="rating"></Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                  <Form.Group controlId="comment"></Form.Group>
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    row="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></Form.Control>
                  <Button
                    disabled={loadingProductReview}
                    type="submit"
                    className="mt-3"
                    variant="outline-secondary"
                  >
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to="/login">sign in</Link> to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
}

export default ProductScreen;
