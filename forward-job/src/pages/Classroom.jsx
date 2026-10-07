import { useLocation, useNavigate } from "react-router";
import { classroomProfiles } from "../data/classroomProfiles";
import LaptopDesktop from "../components/laptop/LaptopDesktop";
import "../css/classroom.css";

function Classroom() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";
    const sem = location.state?.sem || 2;

    // undefined if this character got no seat here
    const profile = classroomProfiles[characterName];

    /**
     * The map page already stop them before teleport , but someone can still
     * type /classroom straight in the url , and that time location.state is null
     * so the map check is totally skipped. This one here is the real door.
     */
    if (!profile) {
        return (
            <div className="classroom-page denied">
                <div className="denied-box">
                    <h2>You cannot enter here</h2>
                    <p>{characterName} has no seat in this classroom.</p>
                    <button type="button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`classroom-page theme-${profile.theme}`}>
            <header className="classroom-top">
                <div>
                    <h1>Classroom Sem {sem}</h1>
                    <p className="classroom-seat">
                        {characterName} {role && `· ${role}`} · {profile.seat}
                    </p>
                </div>

                <button type="button" className="classroom-back" onClick={() => navigate(-1)}>
                    Back to Map
                </button>
            </header>

            {/* the laptop on the desk , apps based on role */}
            <div className="laptop">
                <div className="laptop-screen">
                    <LaptopDesktop apps={profile.apps} defaultApp={profile.defaultApp} />
                </div>
                <div className="laptop-base" />
            </div>
        </div>
    );
}

export default Classroom;
