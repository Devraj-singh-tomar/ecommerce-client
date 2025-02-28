import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { NewOrderRequest } from "../types/api-types";
import { Rootstate } from "../redux/store";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cart-reducer";
import { responsetoast } from "../utils/feature";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(stripeKey);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const {
    cartItems,
    discount,
    shippingCharges,
    shippingInfo,
    subtotal,
    tax,
    total,
  } = useSelector((state: Rootstate) => state.cartReducer);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      discount,
      shippingCharges,
      tax,
      total,
      user: user?._id!,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }

    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);

      dispatch(resetCart());

      responsetoast(res, navigate, "/orders");
    }

    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing" : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
