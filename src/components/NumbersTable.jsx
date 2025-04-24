import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { numbersData } from "../data/table/numbers";
import "../NumbersTable.css";

// Компонент кнопки звука
const SoundButton = ({ arabic }) => {
    const [audioExists, setAudioExists] = useState(null); // null — в процессе проверки

    useEffect(() => {
        const audio = new Audio(`/audio/numbers/${arabic}.mp3`);

        const handleCanPlay = () => {
            setAudioExists(true);
        };

        const handleError = () => {
            setAudioExists(false);
        };

        audio.addEventListener("canplaythrough", handleCanPlay);
        audio.addEventListener("error", handleError);
        audio.load(); // важно — запускает процесс загрузки

        return () => {
            audio.removeEventListener("canplaythrough", handleCanPlay);
            audio.removeEventListener("error", handleError);
        };
    }, [arabic]);

    const handleClick = (e) => {
        e.stopPropagation(); // ⛔️ остановка всплытия
        const audio = new Audio(`/audio/numbers/${arabic}.mp3`);
        audio.play().catch((err) => console.warn("Ошибка воспроизведения:", err));
    };

    if (audioExists !== true) return null;

    return (
        <button
            onClick={handleClick}
            className="btn-sound"
            aria-label="Прослушать произношение"
        >
            <svg
                aria-hidden="true"
                width="16"
                height="14"
                viewBox="0 0 576 512"
                focusable="false"
                className="fa-icon"
            >
                <path
                    d="M215 71.1c15-15 41-4.5 41 17v336c0 21.4-25.9 32-41 17l-89-89h-102.1c-13.3 0-24-10.8-24-24v-144c0-13.3 10.7-24 24-24h102.1zM448.4 20c79.9 52.5 127.7 140.7 127.7 236s-47.7 183.6-127.7 236c-11.6 7.6-26.5 3.8-33.5-7-7.3-11.2-4.2-26.2 7-33.5 66.3-43.5 105.8-116.6 105.8-195.6 0-79-39.6-152.1-105.8-195.6-11.2-7.3-14.3-22.3-7-33.5 7.3-11.2 22.3-14.3 33.5-7zM480 256c0 63.5-32.1 121.9-85.8 156.2-12 7.7-26.6 2.9-33.1-7.5-7.1-11.3-3.8-26.2 7.4-33.4 39.8-25.4 63.5-68.5 63.5-115.4s-23.7-90-63.5-115.4c-11.2-7.2-14.5-22.1-7.4-33.4 7.1-11.3 21.9-14.6 33.1-7.5 53.7 34.3 85.8 92.7 85.8 156.2zM338.2 179.1c28.2 15.5 45.8 45 45.8 76.9s-17.5 61.3-45.8 76.9c-11.6 6.3-26.2 2.2-32.6-9.5-6.4-11.6-2.2-26.2 9.5-32.6 12.9-7.1 20.9-20.4 20.9-34.8 0-14.4-8-27.7-20.9-34.8-11.6-6.4-15.8-21-9.5-32.6 6.4-11.6 21-15.8 32.6-9.5z"/>
            </svg>
        </button>
    );
};


const FlipCard = ({item}) => {
    const [flipped, setFlipped] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkIfTouch = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkIfTouch();
    }, []);

    const handleClick = () => {
        if (isTouchDevice) {
            setFlipped(!flipped);
        }
    };

    return (
        <div className="flip-card" onClick={handleClick}>
            <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
                <div className="flip-card-front">
                    {item.arabic}
                </div>
                <div className="flip-card-back">
                    <div className="flip-card-kanji">{item.kanji}</div>
                    <div className="flip-card-hiragana">{item.reading}</div>
                    <SoundButton arabic={item.arabic}/>
                </div>
            </div>
        </div>
    );
};


// Основной компонент таблицы
const NumbersTable = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const range = location.state?.range;

    const filteredData = range === "1-10"
        ? numbersData.filter(item => +item.correctAnswer <= 10)
        : numbersData;

    return (
        <div className="hiragana-table-container">
            <button
                className="back-button btn-link"
                onClick={() => navigate(-1)}
            >
                ← Назад к тесту
            </button>

            <div className="hiragana-table-content">
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                    Таблица числительных {range === "1-10" ? "(от 1 до 10)" : ""}
                </h2>

                <div className="kana-table">
                    <div className="table-numbers-row">
                        {filteredData.map((item, idx) => (
                            <FlipCard key={idx} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumbersTable;
