import { useEffect, useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import CartItem from "../components/cart-item";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Rootstate } from "../redux/store";

const Cart = () => {
  const { cartItems, subtotal, tax, total, discount, shippingCharges } =
    useSelector((state: Rootstate) => state.cartReducer);

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) {
        setIsValidCouponCode(true);
      } else {
        setIsValidCouponCode(false);
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, idx) => <CartItem key={idx} cartItem={i} />)
        ) : (
          <h1>No items in cart</h1>
        )}
      </main>

      <aside>
        <p>Subtotal: &#8377;{subtotal}</p>
        <p>Shipping Charges: &#8377;{shippingCharges}</p>
        <p>Tax: &#8377;{tax}</p>
        <p>
          Discount: <em>-&#8377;{discount}</em>
        </p>
        <p>
          <b>Total: &#8377;{total}</b>
        </p>

        <input
          placeholder="Coupon code"
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {
          // If coupon code is valid, show a message
          couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                {discount} off by using <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                <MdErrorOutline /> Invalid coupon
              </span>
            ))
        }

        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
