import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../KanaTable.css';

const ROW_LABELS = ['a', 'i', 'u', 'e', 'o'];
const DEFAULT_COLUMN_LABELS = ['-', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', ''];

import { hiraganaGrid } from '../data/table/hiraganaGrid';
import { katakanaGrid } from '../data/table/katakanaGrid';
// import { dakutenRows, handakutenRows, columnLabels as DAKUTEN_COLUMN_LABELS } from '../data/table/dakutenGrid';
import { romajiMap } from '../data/table/romajiMap';
import {
    dakutenRows,
    handakutenRows,
    dakutenLabels,
    handakutenLabels,
} from '../data/table/dakutenGrid';

const KanaTable = () => {
    const [imageError, setImageError] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const navigate = useNavigate();
    const { quiz } = useParams();

    const highlightRef = useRef(null);
    const audioRef = useRef(null);

    let kanaGrid;
    let kanaType;
    let columnLabels;

    if (quiz.includes('dakuten')) {
        kanaType = 'dakuten';
        kanaGrid = dakutenRows;
        columnLabels = dakutenLabels;
    } else if (quiz.includes('handakuten')) {
        kanaType = 'handakuten';
        kanaGrid = handakutenRows;
        columnLabels = handakutenLabels;
    } else if (quiz.includes('katakana')) {
        kanaType = 'katakana';
        kanaGrid = katakanaGrid;
        columnLabels = DEFAULT_COLUMN_LABELS;
    } else {
        kanaType = 'hiragana';
        kanaGrid = hiraganaGrid;
        columnLabels = DEFAULT_COLUMN_LABELS;
    }


    useEffect(() => {
        if (highlightRef.current) {
            highlightRef.current.classList.add('highlight-symbol');
            const timeout = setTimeout(() => {
                highlightRef.current.classList.remove('highlight-symbol');
            }, 6000);
            return () => clearTimeout(timeout);
        }
    }, []);

    const openModal = (symbol) => {
        if (!symbol) return;
        const romaji = romajiMap[symbol];
        setSelectedSymbol({ symbol, romaji });
    };

    const closeModal = () => {
        setSelectedSymbol(null);
    };

    const renderKanaTable = (grid, title, columnLabels, highlightFirst = false) => (
        <>
            {kanaType === 'dakuten' ? (
                <>
                    <h3>{title}</h3>
                </>
            ) : (
                <>
                </>
            )}

            <div className={`table`}>
                <div className="table-row header-row">
                    <div className="table-cell corner-cell" />
                    {ROW_LABELS.map((romaji, idx) => (
                        <div className="table-cell header-cell" key={`header-${idx}`}>
                            {romaji}
                        </div>
                    ))}
                </div>

                {grid.map((row, rowIndex) => (
                    <div className="table-row" key={rowIndex}>
                        <div className="table-cell header-cell vertical-label">
                            {columnLabels[rowIndex] || ''}
                        </div>
                        {row.map((symbol, colIndex) => {
                            const isFirstSymbol = highlightFirst && rowIndex === 0 && colIndex === 0;
                            return (
                                <div className="table-cell" key={colIndex}>
                                    {symbol ? (
                                        <div
                                            className="symbol-wrapper"
                                            ref={isFirstSymbol ? highlightRef : null}
                                            onClick={() => openModal(symbol)}
                                            title="Нажмите на символ, чтобы увидеть его написание и звучание"
                                        >
                                            <span className="symbol">{symbol}</span>
                                        </div>
                                    ) : (
                                        <div className="empty" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </>
    );




    return (
        <div className="hiragana-table-container">
            <button
                className="back-button btn-link"
                onClick={() => navigate(`/quiz/${quiz}`)}
            >
                ← Назад к тесту
            </button>
            <div className="hiragana-table-content">
                <h2>
                    {kanaType === 'katakana'
                        ? 'Катакана'
                        : quiz.includes('dakuten')
                            ? 'Дакутэн / Хандакутэн'
                            : 'Хирагана'}
                </h2>
                <div className="table-description">
                    Нажмите на символ, чтобы увидеть его написание <br /> и услышать произношение
                </div>

                {kanaType === 'dakuten' ? (
                    <>
                        {renderKanaTable(dakutenRows, 'Дакутэн', dakutenLabels, true)}
                        {renderKanaTable(handakutenRows, 'Хандакутэн', handakutenLabels)}
                    </>
                ) : (
                    renderKanaTable(kanaGrid, kanaType === 'katakana' ? 'Катакана' : 'Хирагана', DEFAULT_COLUMN_LABELS, true)
                )}
                {selectedSymbol && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h3>
                                {selectedSymbol.symbol} - {selectedSymbol.romaji}
                            </h3>

                            <img
                                src={`/strokes/${kanaType}/${selectedSymbol.symbol}.gif`}
                                alt={`Stroke order for ${selectedSymbol.symbol}`}
                                className="stroke-image"
                                onError={() => setImageError(true)}
                                style={{ display: imageError ? 'none' : 'block' }}
                            />

                            <audio
                                ref={audioRef}
                                src={`/audio/${kanaType === 'katakana' ? 'hiragana' : kanaType}/${selectedSymbol.romaji}.mp3`}
                                type="audio/mpeg"
                                style={{ display: 'none' }}
                            />

                            <button
                                onClick={() => {
                                    if (audioRef.current) audioRef.current.play();
                                }}
                                className="audio-button"
                                aria-label="Слушать произношение"
                            >
                                <svg aria-hidden="true" width="16" height="14" viewBox="0 0 576 512" className="fa-icon">
                                    <path
                                        d="M215 71.1c15-15 41-4.5 41 17v336c0 21.4-25.9 32-41 17l-89-89h-102.1c-13.3 0-24-10.8-24-24v-144c0-13.3 10.7-24 24-24h102.1zM448.4 20c79.9 52.5 127.7 140.7 127.7 236s-47.7 183.6-127.7 236c-11.6 7.6-26.5 3.8-33.5-7-7.3-11.2-4.2-26.2 7-33.5 66.3-43.5 105.8-116.6 105.8-195.6 0-79-39.6-152.1-105.8-195.6-11.2-7.3-14.3-22.3-7-33.5 7.3-11.2 22.3-14.3 33.5-7zM480 256c0 63.5-32.1 121.9-85.8 156.2-12 7.7-26.6 2.9-33.1-7.5-7.1-11.3-3.8-26.2 7.4-33.4 39.8-25.4 63.5-68.5 63.5-115.4s-23.7-90-63.5-115.4c-11.2-7.2-14.5-22.1-7.4-33.4 7.1-11.3 21.9-14.6 33.1-7.5 53.7 34.3 85.8 92.7 85.8 156.2zM338.2 179.1c28.2 15.5 45.8 45 45.8 76.9s-17.5 61.3-45.8 76.9c-11.6 6.3-26.2 2.2-32.6-9.5-6.4-11.6-2.2-26.2 9.5-32.6 12.9-7.1 20.9-20.4 20.9-34.8 0-14.4-8-27.7-20.9-34.8-11.6-6.4-15.8-21-9.5-32.6 6.4-11.6 21-15.8 32.6-9.5z"
                                    />
                                </svg>
                            </button>

                            <button onClick={closeModal} className="close-button">
                                <svg width="800px" height="800px" viewBox="-0.5 0 25 25" fill="none">
                                    <path d="M3 21.32L21 3.32001" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M3 3.32001L21 21.32" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
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
