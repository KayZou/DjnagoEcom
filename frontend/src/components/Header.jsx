import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LinkContainer } from "react-router-bootstrap";

function Header() {
  return (
    <header>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>DjangoEcom</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <LinkContainer to="/cart">
                <span className="d-inline-flex align-items-center">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="ms-2 me-4">Cart</span>{" "}
                  {/* Added ms-2 for margin */}
                </span>
              </LinkContainer>
              <LinkContainer to="/login">
                <span className="d-inline-flex align-items-center ">
                  <i className="fa-solid fa-right-to-bracket"></i>
                  <span className="ms-2">Login</span>{" "}
                  {/* Added ms-2 for margin */}
                </span>
              </LinkContainer>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-secondary">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
