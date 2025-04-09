import React, { useState } from 'react';

function Card({ option, isCorrect, onAnswer }) {
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    if (!selected) {
      setSelected(true);
      onAnswer(isCorrect);
    }
  };

  return (
    <div
      className={`card ${selected ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
      onClick={handleClick}
    >
      {option}
    </div>
  );
}

export default Card;
