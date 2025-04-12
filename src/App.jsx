import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Quiz from './components/Quiz';
import Home from './components/Home';
import ThemeToggle from './components/ThemeToggle';
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
                            <h2>Выберите тест:</h2>
                            {[
                                ['hiragana', 'あ Хирагана'],
                                ['katakana', 'シ Катакана'],
                                ['dakuten', 'ガ Дакутэн/Хандакутэн'],
                                ['allkana', 'え Вся кана'],
                                ['numbers', '三 Числительные'],
                                ['hiraganaInput', 'ぬ Хираган ввод'],
                                ['katakanaInput', 'ぬ Катакана ввод'],
                                ['dakutenInput', 'ぬ Дакутэн/Хандакутэн ввод'],
                                ['numbersInput', '四 Числительные ввод'],
                            ].map(([key, label]) => (
                                <button key={key} className="quiz-button" onClick={() => startQuiz(key)}>
                                    {label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            {isMobile && isQuizPage && (
                                <button className="back-button" onClick={goBackToMenu}>
                                    ← Назад к тестам
                                </button>
                            )}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/quiz/:quiz" element={<Quiz />} />
                            </Routes>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
