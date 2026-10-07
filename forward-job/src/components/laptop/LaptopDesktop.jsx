import { useState } from "react";
import InboxApp from "./InboxApp";
import ForwardCampusNetwork from "./ForwardCampusNetwork";

/**
 * Simple desktop on the laptop.
 * apps = ["inbox"] or ["inbox", "fcn"]
 */
function LaptopDesktop({ apps = ["inbox"], defaultApp }) {
    const firstApp = defaultApp || apps[0];
    const [openApp, setOpenApp] = useState(firstApp);

    return (
        <div className="laptop-app desktop-shell">
            <div className="desktop-dock">
                {apps.includes("inbox") && (
                    <button
                        type="button"
                        className={openApp === "inbox" ? "dock-btn active" : "dock-btn"}
                        onClick={() => setOpenApp("inbox")}
                    >
                        Inbox
                    </button>
                )}

                {apps.includes("fcn") && (
                    <button
                        type="button"
                        className={openApp === "fcn" ? "dock-btn active" : "dock-btn"}
                        onClick={() => setOpenApp("fcn")}
                    >
                        Campus Network
                    </button>
                )}
            </div>

            <div className="desktop-window">
                {openApp === "inbox" && <InboxApp />}
                {openApp === "fcn" && <ForwardCampusNetwork />}
            </div>
        </div>
    );
}

export default LaptopDesktop;
