import { useLocation, useNavigate } from "react-router";

// For Sir Howie
function MeetingRoom1() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Meeting Room 1</h1>
            <p>
                Welcome {characterName} ({role})
            </p>
            <p>Admin area for Sir Howie.</p>
            <button type="button" onClick={() => navigate("/")}>
                Back to Character
            </button>
        </div>
    );
}

export default MeetingRoom1;
