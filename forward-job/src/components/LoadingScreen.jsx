import { useRef, useState } from "react";
import gtaV from "../images/LoadingScreen.mp4"
import "../css/loadingScreen.css"

function LoadingScreen({ onFinish }) {
    const videoRef = useRef(null);
    const [started, setStarted] = useState(false);

    const handleEnter = () => {
        setStarted(true);
        videoRef.current.muted = false;
        videoRef.current.play();
    };

    return (
        <div className="loading-screen">
            <video src={gtaV} playsInline onEnded={onFinish} ref={videoRef}></video>

            {!started && (
                <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                    <h1 className="loadingT">
                        GTA V: New Version — “Forward College Stories”
                    </h1>

                    <div className="loadingLine"/>

                    <button type="button" className="Lbutton" onClick={handleEnter}>
                        <p className="loadingP">
                            You must click to enter FORWARD COLLEGE STORIES
                        </p>
                    </button>

                    <div className="loadingLine"/>

                </div>
            )}
        </div>
    )
}

export default LoadingScreen