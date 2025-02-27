import { FaPlus } from "react-icons/fa6";
import { server } from "../redux/store";
import { CartItem } from "../types/type";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  handler,
  name,
  photo,
  price,
  productId,
  stock,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>&#8377;{price}</span>

      <div>
        <button
          onClick={() =>
            handler({
              productId,
              photo,
              name,
              price,
              quantity: 1,
              stock,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
