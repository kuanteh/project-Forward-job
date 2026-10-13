import { useEffect, useState } from "react"
import api from "../utils/api"
import MissionComplete from "./MissionComplete"
import "../css/shootingMission.css"
import mikeAim from "../images/Mike.png"

// 10 targets , fixed % on the screen
const spots = [
    { top: "18%", left: "14%" },
    { top: "28%", left: "32%" },
    { top: "16%", left: "52%" },
    { top: "24%", left: "72%" },
    { top: "38%", left: "86%" },
    { top: "48%", left: "20%" },
    { top: "52%", left: "44%" },
    { top: "42%", left: "62%" },
    { top: "58%", left: "78%" },
    { top: "36%", left: "8%" },
]

function ShootingMission({ type, goMap }) {
    const [missionId, setMissionId] = useState("")
    const [hit, setHit] = useState([])
    const [done, setDone] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const startMission = async () => {
            try {
                const userToken = localStorage.getItem("token")
                const response = await api.post(
                    "/missions",
                    { type },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                )
                setMissionId(response.data._id)
            } catch (err) {
                console.log("Start mission error: ", err)
                setError("Cannot start mission.")
            }
        }

        startMission()
    }, [type])

    const handleHit = async (index) => {
        if (!missionId || hit.includes(index) || done) return

        const nextHit = [...hit, index]
        setHit(nextHit)

        if (nextHit.length < 10) return

        try {
            const userToken = localStorage.getItem("token")
            const response = await api.patch(
                `/missions/${missionId}`,
                { status: "completed", collectedCount: 10 },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )

            const savedUser = JSON.parse(localStorage.getItem("user") || "{}")
            savedUser.money = response.data.player?.money ?? (savedUser.money || 0)
            localStorage.setItem("user", JSON.stringify(savedUser))
            setDone(true)
        } catch (err) {
            console.log("Complete mission error: ", err)
            setError("Cannot finish mission.")
        }
    }

    if (error) return <p className="laptop-note error">{error}</p>

    return (
        <div className="shoot-layer">
            <p className="shoot-count">{hit.length} / 10</p>

            {spots.map((spot, index) => (
                <button
                    key={index}
                    type="button"
                    className="shoot-target"
                    style={{ top: spot.top, left: spot.left }}
                    disabled={hit.includes(index)}
                    onClick={() => handleHit(index)}
                />
            ))}

            <div className="mission-aim">
                <img src={mikeAim} alt="Mike" />
            </div>

            {done && <MissionComplete reward={67000} onMap={goMap} />}
        </div>
    )
}

export default ShootingMission
