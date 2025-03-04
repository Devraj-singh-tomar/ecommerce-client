import { FaPlus } from "react-icons/fa6";
import { CartItem } from "../types/type";
import { Link } from "react-router-dom";
import { BsEyeFill } from "react-icons/bs";

type ProductsProps = {
  productId: string;
  photos: {
    url: string;
    public_id: string;
  }[];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  handler,
  name,
  photos,
  price,
  productId,
  stock,
}: ProductsProps) => {
  return (
    <div className="product-card">
      <img src={photos?.[0]?.url} alt={name} />
      <p>{name}</p>
      <span>&#8377;{price}</span>

      <div>
        <button
          onClick={() =>
            handler({
              productId,
              photo: photos[0].url,
              name,
              price,
              quantity: 1,
              stock,
            })
          }
        >
          <FaPlus />
        </button>

        <Link to={`/product/${productId}`}>
          <BsEyeFill />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
