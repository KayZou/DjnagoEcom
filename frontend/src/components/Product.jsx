import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Rating from "./Rating";
import { BACKEND_URL } from "../constants.js"

function Product({ product }) {
  return (
    <>
      <Card className="my-3 p-3 rounded" style={{ height: "445px" }}>
        <Link to={`/product/${product._id}`}>
          <Card.Img
            src={BACKEND_URL + product.image}
            variant="top"
          />
        </Link>
        <Card.Body>
          <Card.Title as="div">
            <strong>
              <b>{product.name}</b>
            </strong>
          </Card.Title>
          <Card.Text as="div">{product.description}</Card.Text>
          <Card.Text as="div">
            <div className="my-3">
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
                color={"gray"}
              />
            </div>
          </Card.Text>
          <Card.Text as="h3">${product.price}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default Product;
