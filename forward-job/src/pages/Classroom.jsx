import { useLocation, useNavigate } from "react-router";

function Classroom() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Classroom</h1>
            <p>
                Welcome {characterName} ({role})
            </p>
            <p>Your seat page will be here later.</p>
            <button type="button" onClick={() => navigate("/")}>
                Back to Character
            </button>
        </div>
    );
}

export default Classroom;
