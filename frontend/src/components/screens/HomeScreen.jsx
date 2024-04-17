import { Row, Col } from "react-bootstrap";
import Product from "../Product";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { listProducts } from "../../actions/productActions";
import Loader from "../Loader";
import Message from "../Message";
import { useParams, useLocation } from "react-router-dom";
import Paginate from "../Paginate";

function HomeScreen() {
  const { search: urlSearch } = useLocation();

  const dispatch = useDispatch();

  const { products, loading, error, pages, page } = useSelector(
    (state) => state.productList
  );

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setKeyword(new URLSearchParams(urlSearch).get("search") || "");
  }, [urlSearch]);

  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <>
      <h1 className="my-3 py-3 text-underline">Latest Products:</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant={"danger"}>Error: {error}</Message>
      ) : (
        <Row>
          {products &&
            products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
        </Row>
      )}
      {/* <Paginate pages={pages} page={page} search={keyword} /> */}
    </>
  );
}

export default HomeScreen;
