import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import { saveShippingAddress } from "../../actions/cartActions";
import CheckoutSteps from "../CheckoutSteps";

function ShippingScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(
      saveShippingAddress({ address, city, postalCode, country, navigate })
    );
    navigate("/payment");
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className="my-3">Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label className="mt-3">Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={address ? address : ""}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label className="mt-3">City</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter city"
            value={city ? city : ""}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label className="mt-3">Postal Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter postal code"
            value={postalCode ? postalCode : ""}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label className="mt-3">Country</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter country"
            value={country ? country : ""}
            required
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="outline-secondary" className="mt-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
