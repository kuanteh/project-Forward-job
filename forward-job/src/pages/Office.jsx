import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import InboxApp from "../components/laptop/InboxApp"
import ForwardCampusNetwork from "../components/laptop/ForwardCampusNetwork"
import kherNeePov from "../images/MsKherNeePOV.png"
import "../css/laptop.css"
import "../css/classroom.css"

function Office () {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Unknown";
    const role = location.state?.role || "";

    const [view,setView] = useState("seat")

    const canEnter = role === "office"

    if(!canEnter){
        return(
            <div className="classroom-page denied">
                <div className="denied-box">
                    <h2>You cannot enter here</h2>
                    <p>Only office can enter here.</p>
                    <button type="button" onClick={() => navigate(-1)}>
                        Back
                    </button>
                </div>
            </div>
        )
    }

    const goMap = () => {
        navigate("/map",{state:{characterName,role}})
    }

    if(view != "seat"){
        return(
            <div className="classroom-page classroom-app-view">
                <button type="button" className="classroom-back seat-back" onClick={() => setView("seat")}>
                    Back to seat
                </button>

                <div className="laptop classroom-app-laptop">
                    <div className="laptop-screen">
                        {view === "inbox" && <InboxApp/>}
                        {view === "fcn" && <ForwardCampusNetwork/>}
                    </div>
                    <div className="laptop-base" />
                </div>
                
            </div>
        )
    }

    return (
        <div
            className="classroom-page classroom-seat-view"
            style={{
                backgroundImage: `url(${kherNeePov})`,
                backgroundPosition: "center",
            }}
        >
            <button type="button" className="classroom-back map-back" onClick={goMap}>
                Back to Map
            </button>
            <div className="desk-apps">
                <button type="button" className="desk-app-btn" onClick={() => setView("inbox")}>
                    Inbox
                </button>
                <button type="button" className="desk-app-btn" onClick={() => setView("fcn")}>
                    Campus Network
                </button>
            </div>
        </div>
    )
}

export default Office
