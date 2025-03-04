import { useRating } from "6pp";
import { BsStar, BsStarFill } from "react-icons/bs";

const RatingComponent = ({ value = 0 }: { value: number }) => {
  const { Ratings } = useRating({
    IconFilled: <BsStarFill />,
    IconOutline: <BsStar />,
    value,
    styles: {
      fontSize: "1.2rem",
      color: "cyan",
    },
  });

  return <Ratings />;
};

export default RatingComponent;
