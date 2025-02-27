import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";

type CartItemProps = {
  cartItem: any;
};

const CartItem = ({ cartItem }: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={`${server}/${photo}`} alt={name} />

      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>&#8377;{price}</span>
      </article>

      <div>
        <button>-</button>
        <p>{quantity}</p>
        <button>+</button>
      </div>

      <button>
        <FaTrashAlt />
      </button>
    </div>
  );
};

export default CartItem;
