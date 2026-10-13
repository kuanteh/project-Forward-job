import { useNavigate , useLocation } from "react-router"
import counter from "../images/counter_outdoor.png"
import MoneyHud from "../components/MoneyHud"
import "../css/classroom.css"
import "../css/shootingMission.css"

function Counter() {   
    const navigate = useNavigate()
    const location = useLocation()
    const characterName = location.state?.characterName || "Unknown"
    const role = location.state?.role || ""
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}")

    const goMap = () => {
        navigate("/map",{state:{ characterName,role}})
    }
    
    return (
        <div
            className="classroom-page classroom-seat-view"
            style={{ backgroundImage:`url(${counter})`,backgroundPosition:"center 70%"}}
        >
            <MoneyHud />
            <button type="button" className="classroom-back map-back" onClick={goMap} >
                Back to Map
            </button>

            {role === "mike" && (
                <p className="counter-earn">
                    You earned ${Number(savedUser.money || 0).toLocaleString()}
                </p>
            )}
        </div>
    )
}

export default Counter;
