// src/components/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Sidebar.css';

const Sidebar = () => {
  const quizGroups = [
    {
      title: 'Основное',
      items: [
        { key: 'hiragana', label: 'あ Хирагана' },
        { key: 'katakana', label: 'シ Катакана' },
        { key: 'dakuten', label: 'ガ Дакутэн/Хандакутэн' },
        { key: 'allkana', label: 'え Вся кана' },
      ],
    },
    {
      title: 'Числительные',
      items: [
        { key: 'numbers', label: '四 Числа' },

      ],
    },
    {
      title: 'Ввод',
      items: [
        { key: 'hiraganaInput', label: 'あ Хирагана' },
        { key: 'katakanaInput', label: 'シ Катакана' },
        { key: 'dakutenInput', label: 'ガ Дакутэн/Хандакутэн' },
        { key: 'numbersInput', label: '四 Числа' },
      ],
    },
  ];

  return (
      <div className="sidebar">
        <nav className="navbar">
          {quizGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="sidebar-group">
                <div className="sidebar-group-title">{group.title}</div>
                {group.items.map(({key, label}) => (
                    <NavLink
                        key={key}
                        to={`/quiz/${key}`}
                        className={({isActive}) =>
                            isActive ? 'sidebar-link active' : 'sidebar-link'
                        }
                    >
                      {label}
                    </NavLink>
                ))}
              </div>
          ))}
        </nav>
      </div>

  );
};

export default Sidebar;
