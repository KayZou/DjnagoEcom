import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { listProductDetails } from "../../actions/productActions";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card } from "react-bootstrap";
import Rating from "../Rating";
import Message from "../Message";
import Loader from "../Loader";
// import products from "../../products";
import { useParams } from "react-router-dom";
import { BACKEND_URL } from "../../constants";

function ProductScreen() {
  const dispatch = useDispatch();
  const {
    product,
    loading,
    error,
  } = useSelector((state) => state.productDetails);
  const { id } = useParams();

  useEffect(() => {
    dispatch(listProductDetails(id));
  }, []);

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
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  variant="outline-secondary"
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ProductScreen;
