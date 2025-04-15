import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { hiraganaData } from '../data/hiragana';
import { katakanaData } from '../data/katakana'; // Создай аналогичный файл
import '../KanaTable.css';

const KanaTable = () => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { quiz } = useParams(); // 'hiragana' или 'katakana'

    const isHiragana = quiz === 'hiragana';
    const data = isHiragana ? hiraganaData : katakanaData;

    const fromQuiz = location.state?.fromQuiz || quiz;

    const buildGrid = (data) => {
        const grid = [];
        for (let i = 0; i < data.length; i += 5) {
            grid.push(data.slice(i, i + 5));
        }
        return grid;
    };

    const GRID = buildGrid(data);



    const openModal = (symbol) => setSelectedSymbol(symbol);
    const closeModal = () => setSelectedSymbol(null);

    return (
        <div className="kana-table-container">
            <h2>Таблица {isHiragana ? 'Хираганы' : 'Катаканы'}</h2>
            <div className="subtitle">Нажмите на символ, чтобы посмотреть написание и послушать звук</div>
            <div className="table">
                {GRID.map((row, rowIndex) => (
                    <div className="table-row" key={rowIndex}>
                        {row.map((item, colIndex) => (
                            <div className="table-cell" key={colIndex}>
                                {item && (
                                    <div
                                        className="symbol-wrapper"
                                        onClick={() => openModal(item)}
                                        title="Нажмите, чтобы посмотреть написание и послушать звук"
                                    >
                                        <span className="symbol">{item.question}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                className="quiz-button back-button"
                onClick={() => navigate(`/quiz/${fromQuiz}`)}
            >
                ← Назад к тесту
            </button>

            {selectedSymbol && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeModal} className="close-button">
                            <svg width="800px" height="800px" viewBox="-0.5 0 25 25" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 21.32L21 3.32001" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M3 3.32001L21 21.32" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <h3>{selectedSymbol.question} — {selectedSymbol.correctAnswer}</h3>
                        <img
                            src={`/strokes/${quiz}/${selectedSymbol.correctAnswer}.gif`}
                            alt={`Stroke order for ${selectedSymbol.question}`}
                            className="stroke-image"
                        />
                        <audio controls className="audio-player">
                            <source
                                src={`/audio/${quiz}/${selectedSymbol.correctAnswer}.mp3`}
                                type="audio/mpeg"
                            />
                            Ваш браузер не поддерживает аудио.
                        </audio>

                    </div>
                </div>
            )}
        </div>
    );
};

export default KanaTable;
