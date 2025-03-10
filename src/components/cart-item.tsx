import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { type CartItem } from "../types/type";

type CartItemProps = {
  cartItem: CartItem;
  incrementHandler: (cartItem: CartItem) => void;
  decrementHandler: (cartItem: CartItem) => void;
  removeHandler: (id: string) => void;
};

const CartItem = ({
  cartItem,
  decrementHandler,
  incrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />

      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>&#8377;{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default CartItem;
