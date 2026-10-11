import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import InboxApp from "../components/laptop/InboxApp";
import ForwardCampusNetwork from "../components/laptop/ForwardCampusNetwork";
import paulPov from "../images/SirPaulPOV.png";
import zeyuPov from "../images/Sem1ClassroomPOVZeYu.png";
import "../css/classroom.css";

function Classroom() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    // seat = look at the desk , inbox / fcn = open that software
    const [view, setView] = useState("seat");

    const canEnter = role === "student" || role === "teacher";

    if (!canEnter) {
        return (
            <div className="classroom-page denied">
                <div className="denied-box">
                    <h2>You cannot enter here</h2>
                    <p>Only student and teacher can enter this classroom.</p>
                    <button type="button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    const background = role === "teacher" ? paulPov : zeyuPov;

    const goMap = () => {
        navigate("/map", { state: { characterName, role } });
    };

    // open software on the laptop
    if (view !== "seat") {
        return (
            <div className="classroom-page classroom-app-view">
                <button type="button" className="classroom-back seat-back" onClick={() => setView("seat")}>
                    Back to Seat
                </button>

                <div className="laptop classroom-app-laptop">
                    <div className="laptop-screen">
                        {view === "inbox" && <InboxApp />}
                        {view === "fcn" && <ForwardCampusNetwork />}
                    </div>
                    <div className="laptop-base" />
                </div>
            </div>
        );
    }

    return (
        <div
            className="classroom-page classroom-seat-view"
            style={{ backgroundImage: `url(${background})`,backgroundPosition:"bottom" }}
        >
            <button type="button" className="classroom-back map-back" onClick={goMap}>
                Back to Map
            </button>

            <div className="desk-apps">
                <button type="button" className="desk-app-btn" onClick={() => setView("inbox")}>
                    Inbox
                </button>

                {role === "teacher" && (
                    <button type="button" className="desk-app-btn" onClick={() => setView("fcn")}>
                        Campus Network
                    </button>
                )}
            </div>
        </div>
    );
}

export default Classroom;
