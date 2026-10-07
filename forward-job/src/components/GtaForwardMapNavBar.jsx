import "../css/gtaForwardMapNavBar.css";

/**
 * The location list on the top right corner , same idea as the GTA V map legend.
 * No useState inside here on purpose , activeId come from GtaForwardMap.
 * If this component keep its own "selected" , the list and the map icon
 * will show two different thing.
 */
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
