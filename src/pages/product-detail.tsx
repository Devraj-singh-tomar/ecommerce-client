import { Navigate, useParams } from "react-router-dom";
import {
  useDeleteReviewMutation,
  useGetAllProductReviewsQuery,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productAPI";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "../components/loader";
import { AiOutlineClose } from "react-icons/ai";
import { Slider, useRating } from "6pp";
import RatingComponent from "../components/ratings";
import { FormEvent, useRef, useState } from "react";
import { addToCart } from "../redux/reducer/cart-reducer";
import toast from "react-hot-toast";
import { CartItem, Review } from "../types/type";
import { Rootstate } from "../redux/store";
import { BsStar, BsStarFill } from "react-icons/bs";
import { responsetoast } from "../utils/feature";
import { BiTrashAlt } from "react-icons/bi";

const ProductDetail = () => {
  const { user } = useSelector((state: Rootstate) => state.userReducer);

  const params = useParams();

  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState<number>(1);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewButtonDisabled, setReviewButtonDisabled] =
    useState<boolean>(false);

  const reviewDialogRef = useRef<HTMLDialogElement>(null);

  const { data, isLoading, isError } = useProductDetailsQuery(params.id!);

  const reviewsResponse = useGetAllProductReviewsQuery(params.id!);

  const [createReview] = useNewReviewMutation();

  const [deleteReview] = useDeleteReviewMutation();

  if (isError) return <Navigate to="/404" />;

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const decrement = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const increment = () => {
    if (data?.product.stock === quantity)
      return toast.error(`only ${data.product.stock} in stock `);

    setQuantity((prev) => prev + 1);
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <BsStarFill />,
    IconOutline: <BsStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.2rem",
      color: "cyan",
    },
  });

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const deleteReviewHandler = async (reviewId: string) => {
    const res = await deleteReview({
      reviewId,
      userId: user?._id,
    });

    responsetoast(res, null, "");
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReviewButtonDisabled(true);
    reviewCloseHandler();

    const res = await createReview({
      comment: reviewComment,
      rating,
      userId: user?._id,
      productId: params.id!,
    });

    setReviewButtonDisabled(false);
    responsetoast(res, null, "");
  };

  return (
    <div className="product-detail">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main className="">
            <section>
              <Slider
                objectFit="contain"
                showNav={false}
                autoplay
                showThumbnails
                images={data?.product.photos.map((i) => i.url) || []}
              />
            </section>

            <section>
              <code>{data?.product?.category}</code>
              <h1>{data?.product?.name.toUpperCase()}</h1>
              <div
                style={{
                  fontSize: "1.7rem",
                  display: "flex",
                  // justifyContent: "flex-end",
                  gap: "5px",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <a href="#reviewScroll">
                  <h4
                    style={{
                      fontSize: "1rem",
                      // position: "absolute",
                      // right: "2rem",
                      textDecoration: "underline",
                    }}
                  >
                    {data?.product.numOfReviews} reviews
                  </h4>
                </a>
                <RatingComponent value={data?.product?.ratings || 0} />
              </div>
              <p>{data?.product?.description}</p>
              <h2>₹{data?.product?.price}</h2>

              <article>
                <div>
                  <button onClick={decrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>

                <button
                  onClick={() =>
                    addToCartHandler({
                      productId: data?.product?._id!,
                      name: data?.product?.name!,
                      price: data?.product?.price!,
                      quantity: quantity,
                      stock: data?.product?.stock!,
                      photo: data?.product?.photos[0]?.url || "",
                    })
                  }
                >
                  Add to cart
                </button>
              </article>
            </section>
          </main>
        </>
      )}

      {/*============= REVIEW DIALOG BOX ================ */}

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>
          <AiOutlineClose />
        </button>

        <h2>write your review</h2>

        <form onSubmit={submitReview}>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="your review..."
          />

          <h2
            style={{
              cursor: "pointer",
              width: "fit-content",
            }}
          >
            {/* <RatingComponent value={2} /> */}
            <RatingsEditable />
          </h2>

          <button disabled={reviewButtonDisabled} type="submit">
            Reviews
          </button>
        </form>
      </dialog>

      <section>
        <div>
          {reviewsResponse.isLoading ? null : (
            <>
              <h2 id="reviewScroll">Reviews</h2>
              {user && <h3 onClick={showDialog}>rate this product</h3>}
            </>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "space-evenly",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsResponse.isLoading ? (
            <Skeleton width="100%" length={3} />
          ) : (
            reviewsResponse.data?.reviews.map((review) => (
              <ReviewCard
                deleteReviewHandler={deleteReviewHandler}
                userId={user?._id}
                key={review._id}
                review={review}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ReviewCard = ({
  review,
  userId,
  deleteReviewHandler,
}: {
  userId?: string;
  review: Review;
  deleteReviewHandler: (reviewId: string) => void;
}) => (
  <div className="review">
    <div>
      <img
        src={
          review.user.photo ||
          "https://cdn.pixabay.com/photo/2021/07/25/08/03/account-6491185_960_720.png"
        }
        alt="user"
      />
      <small>{review.user.name}</small>
    </div>
    <RatingComponent value={review.rating} />
    <p>{review.comment}</p>

    {userId === review.user._id && (
      <h3 title="Delete Review" onClick={() => deleteReviewHandler(review._id)}>
        <BiTrashAlt />
      </h3>
    )}
  </div>
);

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          containerHeight="100%"
          width="100%"
          height="100%"
          length={1}
        />
      </section>
      <section style={{ width: "100%" }}>
        <Skeleton width="100%" length={8} />
      </section>
    </div>
  );
};

export default ProductDetail;
