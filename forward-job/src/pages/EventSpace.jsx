import { useState } from "react"
import { useNavigate , useLocation } from "react-router"
import Espace from "../images/EventSpace.png"
import MoneyHud from "../components/MoneyHud"
import ShootingMission from "../components/ShootingMission"
import "../css/classroom.css"
import "../css/shootingMission.css"

function EventSpace() {   
    const navigate = useNavigate()
    const location = useLocation()
    const characterName = location.state?.characterName || "Unknown"
    const role = location.state?.role || ""
    const [playing, setPlaying] = useState(false)

    const goMap = () => {
        navigate("/map",{state:{ characterName,role}})
    }
    
    return (
        <div
            className="classroom-page classroom-seat-view"
            style={{ backgroundImage:`url(${Espace})`,backgroundPosition:"center 52%"}}
        >
            <MoneyHud />
            <button type="button" className="classroom-back map-back" onClick={goMap} >
                Back to Map
            </button>

            {role === "mike" && !playing && (
                <button type="button" className="mission-start-btn" onClick={() => setPlaying(true)}>
                    Mission Start
                </button>
            )}

            {playing && <ShootingMission type="event" goMap={goMap} />}
        </div>
    )
}

export default EventSpace;
