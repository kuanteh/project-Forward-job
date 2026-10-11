import { useNavigate , useLocation } from "react-router"
import counter from "../images/counter_outdoor.png"
import "../css/classroom.css"


function Counter() {   
    const navigate = useNavigate()
    const location = useLocation()
    // useLocation to get the state
    const characterName = location.state?.characterName || "Unknown"
    const role = location.state?.role || ""

    const goMap = () => {
        navigate("/map",{state:{ characterName,role}})
    }
    
    return (
        <div
            className="classroom-page classroom-seat-view"
            style={{ backgroundImage:`url(${counter})`,backgroundPosition:"center 70%"}}
        >
            {/* <h1 className="text-center mb-5">
                Software Engineer need more breaks...
            </h1> */}
            <button type="button" className="classroom-back map-back" onClick={goMap} >
                Back to Map
            </button>
        </div>
    )

}

export default Counter;
