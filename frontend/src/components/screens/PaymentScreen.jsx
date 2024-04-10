import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import { savePaymentMethod } from "../../actions/cartActions";
import CheckoutSteps from "../CheckoutSteps";

function PaymentScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state) => state.cart);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  if (!shippingAddress) {
    navigate("/shipping");
  }

  async function submitHandler(e) {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="my-3">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend" className="my-3">
            Select Method
          </Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
            </Form.Check>
          </Col>
        </Form.Group>
        <Button type="submit" variant="outline-secondary" className="my-3">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
}

export default PaymentScreen;
