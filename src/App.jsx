import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Quiz from './components/Quiz';
import Home from './components/Home';
import ThemeToggle from './components/ThemeToggle';
import KanaTable from './components/KanaTable';
import NumbersTable from "./components/NumbersTable";


import './App.css';

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showMenu, setShowMenu] = useState(true);
    const [slideDirection, setSlideDirection] = useState('in');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobile) {
            if (location.pathname === '/') {
                setShowMenu(true);
            } else if (location.pathname.startsWith('/quiz/')) {
                setShowMenu(false);
            }
        }
    }, [location.pathname, isMobile]);

    const startQuiz = (path) => {
        setSlideDirection('out');
        setTimeout(() => {
            navigate(`/quiz/${path}`);
            setShowMenu(false);
            setSlideDirection('in');
        }, 300); // Время должно совпадать с CSS анимацией
    };

    const goBackToMenu = () => {
        setSlideDirection('out');
        setTimeout(() => {
            navigate(`/`);
            setShowMenu(true);
            setSlideDirection('in');
        }, 300);
    };

    const isQuizPage = location.pathname.startsWith('/quiz/');

    return (
        <div>
            {isMobile && isQuizPage && (
                <button className="back-button" onClick={goBackToMenu}>
                    ← Назад к тестам
                </button>
            )}
            <ThemeToggle />
            <div className="quiz-container">
                {!isMobile && <Sidebar />}

                <div
                    className={`quiz-questions ${isMobile ? 'mobile-view' : ''} ${
                        slideDirection === 'in' ? 'slide-in' : 'slide-out'
                    }`}
                >
                    {isMobile && showMenu ? (
                        <div className="mobile-menu">
                            <div>
                                <div className="subtitle">こんにちは!</div>
                                <h1>Добро пожаловать в японский квиз!</h1>
                                <p className="desktop-description">Выберите один из тестов в меню слева, чтобы начать
                                    изучение японского
                                    языка.</p>
                                <p className="mobile-description">Выберите один из тестов, чтобы начать изучение
                                    японского
                                    языка.</p>
                                <div className="subtitle">がんばって！</div>
                            </div>


                            <div className="mobile-buttons">
                            {[
                                ['hiragana', <><span>あ</span> Хирагана</>],
                                ['katakana', <><span>シ</span> Катакана</>],
                                ['dakuten', <><span>ガ</span> Дакутэн/Хандакутэн</>],
                                ['allkana', <><span>え</span> Вся кана</>],
                                ['numbers', <><span>三</span> Числительные</>],
                                ['hiraganaInput', <><span>ぬ</span> Хирагана ввод</>],
                                ['katakanaInput', <><span>ぬ</span> Катакана ввод</>],
                                ['dakutenInput', <><span>ぬ</span> Дакутэн/Хандакутэн ввод</>],
                                ['numbersInput', <><span>四</span> Числительные ввод</>],
                            ].map(([key, label]) => (
                                <button key={key} className="quiz-button" onClick={() => startQuiz(key)}>
                                    {label}
                                </button>
                            ))}
                            </div>
                        </div>
                    ) : (
                        <>

                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/quiz/:quiz" element={<Quiz />} />
                                <Route path="/quiz/:quiz/table" element={<KanaTable />} />
                                <Route path="/quiz/numbers/table" element={<NumbersTable />} />
                            </Routes>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
