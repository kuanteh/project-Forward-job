import "../css/gtaForwardMapNavBar.css";

function GtaForwardMapNavBar({ locations, activeId, onSelect }) {
    return (
        <nav className="map-navbar">
            <p className="map-navbar-title">Locations</p>

            <ul>
                {locations.map((place) => (
                    <li key={place.id}>
                        <button
                            type="button"
                            className={place.id === activeId ? "nav-item active" : "nav-item"}
                            onClick={() => onSelect(place.id)}
                        >
                            <span className="nav-label">{place.label}</span>
                            <span className="nav-icon">{place.icon}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default GtaForwardMapNavBar;
