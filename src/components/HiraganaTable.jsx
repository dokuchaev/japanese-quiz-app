import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StrokeModal from './StrokeModal';


const HIRAGANA = [
    ['あ', 'い', 'う', 'え', 'お'],
    ['か', 'き', 'く', 'け', 'こ'],
    ['さ', 'し', 'す', 'せ', 'そ'],
    ['た', 'ち', 'つ', 'て', 'と'],
    ['な', 'に', 'ぬ', 'ね', 'の'],
    ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['ま', 'み', 'む', 'め', 'も'],
    ['や', '', 'ゆ', '', 'よ'],
    ['ら', 'り', 'る', 'れ', 'ろ'],
    ['わ', '', '', '', 'を'],
    ['ん', '', '', '', ''],
];

const HiraganaTable = () => {
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const navigate = useNavigate();

    const playSound = (symbol) => {
        const audio = new Audio(`/audio/hiragana/${symbol}.mp3`);
        audio.play();
    };

    const openModal = (symbol) => {
        playSound(symbol);
        setSelectedSymbol(symbol);
    };

    return (
        <div className="hiragana-table-container">
            <h2>Таблица Хираганы</h2>
            <div className="table">
                {HIRAGANA.map((row, rowIndex) => (
                    <div className="table-row" key={rowIndex}>
                        {row.map((symbol, colIndex) => (
                            <div className="table-cell" key={colIndex}>
                                {symbol ? (
                                    <div className="symbol-wrapper">
                                        <span className="symbol">{symbol}</span>
                                        <button
                                            className="play-button"
                                            onClick={() => openModal(symbol)}
                                            title="Произношение и написание"
                                        >
                                            🔊✍️
                                        </button>
                                    </div>
                                ) : (
                                    <div className="table-cell empty" />
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                ← Назад к тестам
            </button>

            {selectedSymbol && (
                <StrokeModal
                    symbol={selectedSymbol}
                    onClose={() => setSelectedSymbol(null)}
                />
            )}
        </div>
    );
};

export default HiraganaTable;
