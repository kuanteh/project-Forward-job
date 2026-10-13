import "../css/missionComplete.css"

function MissionComplete({ reward, onMap }) {
    return (
        <div className="mission-overlay">
            <h1 className="mission-title">mission complete</h1>
            <div className="mission-rule" />
            <p className="mission-earn">Money Earned  ${reward.toLocaleString()}</p>
            <div className="mission-rule" />
            <button type="button" className="mission-map-btn" onClick={onMap}>
                Back to Map
            </button>
        </div>
    )
}

export default MissionComplete
