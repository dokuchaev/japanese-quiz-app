// src/components/Home.jsx

import React from 'react';

const Home = () => {
  return (
      <div>
          <div className="subtitle">こんにちは!</div>
          <h1>Добро пожаловать в японский квиз!</h1>
          <p className="desktop-description">Выберите один из тестов в меню слева, чтобы начать изучение японского
              языка.</p>
          <p className="mobile-description">Выберите один из тестов, чтобы начать изучение японского
              языка.</p>
          <div className="subtitle">がんばって！</div>
      </div>
  );
};

export default Home;
