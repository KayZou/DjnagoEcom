import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";

function SearchFrom() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (search) {
      navigate(`/?search=${search}&page=1`);
    } else {
      const currentUrl = new URL(location.href);
      const queryParams = currentUrl.searchParams.toString();
      navigate(`${location.pathname}${queryParams}`);
    }
  }

  return (
    <Form className="d-flex" onSubmit={handleSubmit}>
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        name="q"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button variant="outline-secondary" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default SearchFrom;
