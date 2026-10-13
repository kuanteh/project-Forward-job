import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import GtaForwardMapNavBar from "../components/GtaForwardMapNavBar";
import { mapLocations } from "../data/mapLocations";
import mapImage from "../images/forward-map.jpg";
import "../css/gtaForwardMap.css";

function GtaForwardMap() {
    const location = useLocation();
    const navigate = useNavigate();
    // characterName and role come from Character.jsx
    const characterName = location.state?.characterName || "Michael De Santa";
    const role = location.state?.role || "";

    // start on a place everybody can enter , if not Mike open the map and
    // the first teleport already give him an error
    const firstOpenPlace = mapLocations.find((place) => !place.allowRoles);

    /**
     * activeId = which icon you are standing on now.
     * Click the icon or click the list on the right , both just change this one,
     * then the green icon / the label / the teleport button all follow it.
     */
    const [activeId, setActiveId] = useState(firstOpenPlace.id);
    const [blockedMessage, setBlockedMessage] = useState("");

    const activeLocation = mapLocations.find((place) => place.id === activeId);

    // (id) onclick 传上来 的 place id 在传给 setActiveId
    const handleSelect = (id) => {
        // remember your current active ID (你选中的Icon)
        setActiveId(id);
        // clear 掉之前 "access denied" 的message
        setBlockedMessage("");
    };

    const handleTeleport = () => {
        // current active location
        // path : mapLocations.js 的path
        const { label, path, extraState, allowRoles } = activeLocation;

        // check role is in allowRoles ( 限制名单)
        // 如果 role 不在 allowRoles 里面 就显示 xxx cannot enter classroom
        if (allowRoles && !allowRoles.includes(role)) {
            setBlockedMessage(`${characterName} cannot enter ${label}.`);
            // stop , 不要跳页
            return;
        }

        // state 是把信息带过去，下一页就可以知道你是谁
        // so 到 classroom 就可以用 
        //  location.state.CharacterName 
        navigate(path, { state: { characterName, role, ...extraState } });
    };

    return (
        <div className="map-page">
            <div className="map-stage" style={{ backgroundImage: `url(${mapImage})` }}>
                <div className="map-hud">
                    <strong>{characterName}</strong> · {role}
                </div>

                {/* 
                    mapLocation 是Array 
                    place 是 Array 的 object
                */}
                {mapLocations.map((place) => (
                    <button
                        key={place.id}
                        type="button"
                        className={place.id === activeId ? "map-icon active" : "map-icon"}
                        style={{ left: `${place.x}%`, top: `${place.y}%` }}
                        title={place.label}
                        // handleSelect 传进去 place的id 
                        onClick={() => handleSelect(place.id)}
                    >
                        {place.icon}
                    </button>
                ))}

                {/* props location get the value mapLocations */}
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
                    <div className="loading-overlay d-flex flex-column align-items-center justify-content-center">
                    <h1 className="loadingT">
                        ERROR -- you no have permission to Enter
                    </h1>

                    <div className="loadingLine"/>

                    <button type="button" className="Lbutton" onClick={() => setBlockedMessage("")}>
                        <p className="loadingP">
                            {blockedMessage}
                            <br />
                            OK
                        </p>
                    </button>

                    <div className="loadingLine"/>

                </div>
                )}
            </div>
        </div>
    );
}

export default GtaForwardMap;
