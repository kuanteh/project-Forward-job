import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import GtaForwardMapNavBar from "../components/GtaForwardMapNavBar";
import { mapLocations } from "../data/mapLocations";
import mapImage from "../images/forward-map.jpg";
import "../css/gtaForwardMap.css";

function GtaForwardMap() {
    const location = useLocation();
    const navigate = useNavigate();
    const characterName = location.state?.characterName || "Michael De Santa";
    const role = location.state?.role || "";

    // start on a place everybody can enter , if not Mike open the map and
    // the first teleport already give him an error
    const firstOpenPlace = mapLocations.find((place) => !place.allowCharacters);

    /**
     * activeId = which icon you are standing on now.
     * Click the icon or click the list on the right , both just change this one,
     * then the green icon / the label / the teleport button all follow it.
     */
    const [activeId, setActiveId] = useState(firstOpenPlace.id);
    const [blockedMessage, setBlockedMessage] = useState("");

    const activeLocation = mapLocations.find((place) => place.id === activeId);

    const handleSelect = (id) => {
        setActiveId(id);
        // change place already , so the old error message no need to stay
        setBlockedMessage("");
    };

    const handleTeleport = () => {
        const { label, path, extraState, allowCharacters } = activeLocation;

        // some place only open for certain character ( eg. the classroom )
        if (allowCharacters && !allowCharacters.includes(characterName)) {
            setBlockedMessage(`${characterName} cannot enter ${label}.`);
            return;
        }

        navigate(path, { state: { characterName, role, ...extraState } });
    };

    return (
        <div className="map-page">
            <div className="map-stage" style={{ backgroundImage: `url(${mapImage})` }}>
                <div className="map-hud">
                    <strong>{characterName}</strong> {role && `· ${role}`}
                </div>

                {mapLocations.map((place) => (
                    <button
                        key={place.id}
                        type="button"
                        className={place.id === activeId ? "map-icon active" : "map-icon"}
                        style={{ left: `${place.x}%`, top: `${place.y}%` }}
                        title={place.label}
                        onClick={() => handleSelect(place.id)}
                    >
                        {place.icon}
                    </button>
                ))}

                <GtaForwardMapNavBar locations={mapLocations} activeId={activeId} onSelect={handleSelect} />

                <div className="map-bottom">
                    <p className="map-active-label">{activeLocation.label}</p>
                    <button className="teleport-btn" type="button" onClick={handleTeleport}>
                        Teleport
                    </button>
                </div>

                <button className="map-back-btn" type="button" onClick={() => navigate("/")}>
                    Back to Character
                </button>

                {blockedMessage && (
                    <div className="map-popup">
                        <div className="map-popup-box">
                            <h3>Access Denied</h3>
                            <p>{blockedMessage}</p>
                            <button type="button" onClick={() => setBlockedMessage("")}>
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GtaForwardMap;
