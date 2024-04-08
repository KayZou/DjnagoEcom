import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userActions";

function Header() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);

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
                </span>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="navbarScrollingDropdown">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <i className="fa-solid fa-user"></i>
                      <span className="ms-2">Profile</span>
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={() => dispatch(logout())}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span className="ms-2">Logout</span>
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <span className="d-inline-flex align-items-center ">
                    <i className="fa-solid fa-right-to-bracket"></i>
                    <span className="ms-2">Login</span>{" "}
                  </span>
                </LinkContainer>
              )}
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
