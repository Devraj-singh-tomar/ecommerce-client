import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";

const Home = () => {
  const addToCartHandler = () => {};

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
        <ProductCard
          productId="asd"
          name="Samsung"
          price={3000}
          stock={12}
          photo="https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-5g-1.jpg"
          handler={addToCartHandler}
        />
      </main>
    </div>
  );
};

export default Home;
