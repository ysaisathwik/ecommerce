import { FaStar } from "react-icons/fa";

function StarRating({ rating, setRating }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={25}
          style={{ cursor: "pointer", marginRight: "5px" }}
          color={star <= rating ? "gold" : "gray"}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}

export default StarRating;