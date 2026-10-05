import { useLocation, useNavigate } from "react-router";
import "../css/gtaForwardMap.css";

function GtaForwardMap() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Mike";

    return (
        <div className="gtaForwardMap" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Forward Campus Map</h1>
            <p>Welcome {characterName}</p>
            <p>Free roam map for Mike.</p>
            <button type="button" onClick={() => navigate("/")}>
                Back to Character
            </button>
        </div>
    );
}

export default GtaForwardMap;