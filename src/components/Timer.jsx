import React from 'react';

function Timer({ timeLeft }) {
  return (
    <div className="timer">
      <p>Осталось времени: {timeLeft} секунд</p>
    </div>
  );
}

export default Timer;
