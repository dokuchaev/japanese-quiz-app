// StrokeModal.jsx
import React from 'react';
import '../StrokeModal.css';

const StrokeModal = ({ symbol, onClose }) => {
    return (
        <div className="stroke-modal-overlay" onClick={onClose}>
            <div className="stroke-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Порядок написания: {symbol}</h3>
                <img
                    src={`/strokes/hiragana/${symbol}.gif`}
                    alt={`Порядок написания ${symbol}`}
                    className="stroke-image"
                />
                <button onClick={onClose} className="close-button">Закрыть</button>
            </div>
        </div>
    );
};

export default StrokeModal;
