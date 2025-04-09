// src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Sidebar.css';

const Sidebar = () => {
  const quizzes = [
    { key: 'hiragana', label: 'あ Хирагана' },
    { key: 'katakana', label: 'シ Катакана' },
    { key: 'dakuten', label: 'ガ Дакутен/Хандакутэн' },
    { key: 'allkana', label: 'え Вся кана' },
    { key: 'numbers', label: '三 Числительные' },
    { key: 'hiraganaQuiz', label: 'ぬ Кана ввод' }  // Новый пункт для квиза
  ];

  return (
    <div className="sidebar">
      <nav className="navbar">
        {quizzes.map(({ key, label }) => (
          <NavLink
            key={key}
            to={`/quiz/${key}`}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
