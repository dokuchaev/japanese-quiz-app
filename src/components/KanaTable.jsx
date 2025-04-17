import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../KanaTable.css';
import StrokeModal from './StrokeModal';

// Импорт подписей для строк и столбцов
const ROW_LABELS = ['a', 'i', 'u', 'e', 'o'];
const DEFAULT_COLUMN_LABELS = ['-', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', ''];
const DAKUTEN_COLUMN_LABELS = ['g', 'z', 'd', 'b', 'p'];

// Импорт сеток символов
import { hiraganaGrid } from '../data/table/hiraganaGrid';
import { katakanaGrid } from '../data/table/katakanaGrid';
import { dakutenGrid } from '../data/table/dakutenGrid';

// Импорт romaji-маппинга
import { romajiMap } from '../data/table/romajiMap';

const KanaTable = () => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const navigate = useNavigate();
    const { quiz } = useParams();

    // Определение нужной таблицы
    let kanaGrid;
    let kanaType;
    let columnLabels;

    if (quiz.includes('dakuten')) {
        kanaGrid = dakutenGrid;
        kanaType = 'hiragana';
        columnLabels = DAKUTEN_COLUMN_LABELS;
    } else if (quiz.includes('katakana')) {
        kanaGrid = katakanaGrid;
        kanaType = 'katakana';
        columnLabels = DEFAULT_COLUMN_LABELS;
    } else {
        kanaGrid = hiraganaGrid;
        kanaType = 'hiragana';
        columnLabels = DEFAULT_COLUMN_LABELS;
    }

    const openModal = (symbol) => {
        if (!symbol) return;
        const romaji = romajiMap[symbol];
        setSelectedSymbol({ symbol, romaji });
    };

    const closeModal = () => {
        setSelectedSymbol(null);
    };

    return (
        <div className="hiragana-table-container">
            <button
                className="back-button btn-link"
                onClick={() => navigate(`/quiz/${quiz}`)}
            >
                ← Назад к тесту
            </button>
            <div className="hiragana-table-content">
                <h2> {kanaType === 'katakana' ? 'Катакана' : quiz.includes('dakuten') ? 'Дакутэн/Хандакутен' : 'Хирагана'}</h2>
                <div className="table">
                    {/* Горизонтальные romaji */}
                    <div className="table-row header-row">
                        <div className="table-cell corner-cell"/>
                        {ROW_LABELS.map((romaji, idx) => (
                            <div className="table-cell header-cell" key={`header-${idx}`}>
                                {romaji}
                            </div>
                        ))}
                    </div>

                    {/* Основная таблица */}
                    {kanaGrid.map((row, rowIndex) => (
                        <div className="table-row" key={rowIndex}>
                            <div className="table-cell header-cell vertical-label">
                                {columnLabels[rowIndex]}
                            </div>
                            {row.map((symbol, colIndex) => (
                                <div className="table-cell" key={colIndex}>
                                    {symbol ? (
                                        <div
                                            className="symbol-wrapper"
                                            onClick={() => openModal(symbol)}
                                            title="Нажмите, чтобы посмотреть написание и послушать звук"
                                        >
                                            <span className="symbol">{symbol}</span>
                                        </div>
                                    ) : (
                                        <div className="empty"/>
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>


                {selectedSymbol && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>{selectedSymbol.symbol} - {selectedSymbol.romaji}</h3>
                            <img
                                src={`/strokes/${kanaType}/${selectedSymbol.romaji}.gif`}
                                alt={`Stroke order for ${selectedSymbol.symbol}`}
                                className="stroke-image"
                            />
                            <audio controls className="audio-player">
                                <source
                                    src={`/audio/${kanaType}/${selectedSymbol.romaji}.mp3`}
                                    type="audio/mpeg"
                                />
                                Ваш браузер не поддерживает аудио.
                            </audio>
                            <button onClick={closeModal} className="close-button">
                                <svg width="800px" height="800px" viewBox="-0.5 0 25 25" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 21.32L21 3.32001" stroke="#ffffff" strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M3 3.32001L21 21.32" stroke="#ffffff" strokeWidth="1.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
            );
            };

            export default KanaTable;
