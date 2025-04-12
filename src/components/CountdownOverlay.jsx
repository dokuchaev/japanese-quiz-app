import ReactDOM from "react-dom";
import '../CountdownModal.css';

const CountdownOverlay = ({ countdown }) => {
    return ReactDOM.createPortal(
        <div className="countdown-overlay">
            <div key={countdown} className="countdown-number">
                {countdown > 0 ? countdown : "スタート!"}
            </div>
        </div>,
        document.body
    );
};

export default CountdownOverlay;
