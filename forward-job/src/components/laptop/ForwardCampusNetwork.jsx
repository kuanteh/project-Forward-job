import { useState } from "react";
import DailyAttendance from "./DailyAttendance";
import ReviewAttendance from "./ReviewAttendance";
import ManageUsers from "./ManageUsers";
import "../../css/fcn.css";
import "../../css/loadingScreen.css";

function ForwardCampusNetwork() {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = savedUser.role || "";

    const getDefaultMenu = () => {
        if (role === "teacher") return "daily";
        if (role === "office") return "review";
        if (role === "admin") return "manage";
        return "daily";
    };

    const [menu, setMenu] = useState(getDefaultMenu());
    const [blockedMessage, setBlockedMessage] = useState("");

    const canOpen = (key) => {
        if (key === "daily") return role === "teacher";
        if (key === "review") return role === "office";
        if (key === "manage") return role === "admin";
        return false;
    };

    const handleMenu = (key) => {
        if (!canOpen(key)) {
            setBlockedMessage(`${savedUser.characterName} cannot access this.`);
            return;
        }
        setBlockedMessage("");
        setMenu(key);
    };

    if (!role || role === "student" || role === "mike") {
        return <p className="laptop-note">No access to Forward Campus Network.</p>;
    }

    return (
        <div className="laptop-app fcn-app">
            <div className="app-bar">
                <div className="fcn-header-left">
                    <span className="app-title">Forward Campus Network</span>
                    <span className="app-count">{savedUser.characterName}</span>
                </div>
            </div>

            <div className="fcn-body">
                <aside className="fcn-sidebar">
                    <button
                        type="button"
                        className={menu === "daily" ? "fcn-nav active" : "fcn-nav"}
                        onClick={() => handleMenu("daily")}
                    >
                        Daily Attendance
                    </button>
                    <button
                        type="button"
                        className={menu === "review" ? "fcn-nav active" : "fcn-nav"}
                        onClick={() => handleMenu("review")}
                    >
                        Review Attendance
                    </button>
                    <button
                        type="button"
                        className={menu === "manage" ? "fcn-nav active" : "fcn-nav"}
                        onClick={() => handleMenu("manage")}
                    >
                        Manage Users
                    </button>
                </aside>

                <div className="fcn-content">
                    {menu === "daily" && canOpen("daily") && <DailyAttendance />}
                    {menu === "review" && canOpen("review") && <ReviewAttendance />}
                    {menu === "manage" && canOpen("manage") && <ManageUsers />}
                </div>
            </div>

            {blockedMessage && (
                <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                    <h1 className="loadingT">
                        ERROR -- you no have permission to Enter
                    </h1>

                    <div className="loadingLine"/>

                    <button type="button" className="Lbutton" onClick={() => setBlockedMessage("")}>
                        <p className="loadingP">
                            {blockedMessage}
                            <br />
                            click here to quit
                        </p>
                    </button>

                    <div className="loadingLine"/>
                </div>
            )}
        </div>
    );
}

export default ForwardCampusNetwork;
