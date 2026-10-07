import { useLocation, useNavigate } from "react-router";

function Counter() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Counter</h1>
            <p>
                Welcome {characterName} ({role})
            </p>
            <button type="button" onClick={() => navigate(-1)}>
                Back to Map
            </button>
        </div>
    );
}

export default Counter;
