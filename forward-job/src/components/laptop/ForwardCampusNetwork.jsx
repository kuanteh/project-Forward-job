import { useState } from "react";
import DailyAttendance from "./DailyAttendance";
import ReviewAttendance from "./ReviewAttendance";
import ManageUsers from "./ManageUsers";

/**
 * One software for teacher / office / admin.
 * Sidebar menus show based on role (RBAC).
 */
function ForwardCampusNetwork() {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const role = savedUser.role || "";

    // pick first menu this role can open
    const getDefaultMenu = () => {
        if (role === "teacher") return "daily";
        if (role === "office") return "review";
        if (role === "admin") return "manage";
        return "";
    };

    const [menu, setMenu] = useState(getDefaultMenu());

    if (!role || role === "student" || role === "mike") {
        return <p className="laptop-note">No access to Forward Campus Network.</p>;
    }

    return (
        <div className="laptop-app fcn-app">
            <div className="app-bar">
                <span className="app-title">Forward Campus Network</span>
                <span className="app-count">{savedUser.characterName}</span>
            </div>

            <div className="fcn-body">
                <aside className="fcn-sidebar">
                    {role === "teacher" && (
                        <button
                            type="button"
                            className={menu === "daily" ? "fcn-nav active" : "fcn-nav"}
                            onClick={() => setMenu("daily")}
                        >
                            Daily Attendance
                        </button>
                    )}

                    {role === "office" && (
                        <button
                            type="button"
                            className={menu === "review" ? "fcn-nav active" : "fcn-nav"}
                            onClick={() => setMenu("review")}
                        >
                            Review Attendance
                        </button>
                    )}

                    {role === "admin" && (
                        <>
                            <button
                                type="button"
                                className={menu === "manage" ? "fcn-nav active" : "fcn-nav"}
                                onClick={() => setMenu("manage")}
                            >
                                Manage Users
                            </button>
                            <button
                                type="button"
                                className={menu === "review" ? "fcn-nav active" : "fcn-nav"}
                                onClick={() => setMenu("review")}
                            >
                                Review Attendance
                            </button>
                        </>
                    )}
                </aside>

                <div className="fcn-content">
                    {menu === "daily" && <DailyAttendance />}
                    {menu === "review" && <ReviewAttendance />}
                    {menu === "manage" && <ManageUsers />}
                </div>
            </div>
        </div>
    );
}

export default ForwardCampusNetwork;
