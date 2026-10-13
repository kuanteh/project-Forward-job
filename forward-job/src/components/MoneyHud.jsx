import "../css/shootingMission.css"

function MoneyHud() {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}")
    if (savedUser.role !== "mike") return null

    const money = savedUser.money || 0

    return (
        <div className="money-hud">
            ${money.toLocaleString()}
        </div>
    )
}

export default MoneyHud
