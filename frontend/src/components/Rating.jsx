import React from "react";

function Rating({ value, text, color }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const isFullStar = value >= index + 1;
    const isHalfStar = value >= index + 0.5 && value < index + 1;
    return (
      <span key={index}>
        <i
          style={{ color }}
          className={
            isFullStar
              ? "fas fa-star"
              : isHalfStar
              ? "fas fa-star-half-alt"
              : "far fa-star"
          }
        ></i>
      </span>
    );
  });

  return (
    <div className="rating">
      {stars} {text && <span>{text}</span>}
    </div>
  );
}

export default Rating;
