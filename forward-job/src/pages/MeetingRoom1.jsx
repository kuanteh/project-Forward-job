import { useLocation, useNavigate } from "react-router";
import LaptopDesktop from "../components/laptop/LaptopDesktop";
import "../css/classroom.css";

// Sir Howie admin desk
function MeetingRoom1() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    if (role !== "admin") {
        return (
            <div className="classroom-page denied">
                <div className="denied-box">
                    <h2>You cannot enter here</h2>
                    <p>{characterName} has no access to Meeting Room 1.</p>
                    <button type="button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="classroom-page theme-howie">
            <header className="classroom-top">
                <div>
                    <h1>Meeting Room 1</h1>
                    <p className="classroom-seat">
                        {characterName} · {role} · Admin desk
                    </p>
                </div>

                <button type="button" className="classroom-back" onClick={() => navigate(-1)}>
                    Back
                </button>
            </header>

            <div className="laptop">
                <div className="laptop-screen">
                    <LaptopDesktop apps={["inbox", "fcn"]} defaultApp="fcn" />
                </div>
                <div className="laptop-base" />
            </div>
        </div>
    );
}

export default MeetingRoom1;
