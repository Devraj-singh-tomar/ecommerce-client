import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/type";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cart-reducer";

const Home = () => {
  const { data, isLoading, isError } = useLatestProductsQuery("");

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");

    dispatch(addToCart(cartItem));
  };

  if (isError) toast.error("Products fetching failed");

  return (
    <div className="home">
      <section></section>

      <h1>
        Newest Releases
        <Link to={"/search"} className="findmore">
          <IoIosArrowDroprightCircle size={40} title="more products" />
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} style={{ height: "20.5rem" }}>
                <Skeleton width="15.5rem" length={1} height="20rem" />

                {/* <Skeleton width="18.75rem" length={2} height="1.95rem" /> */}
              </div>
            ))}
          </>
        ) : (
          data?.products.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
