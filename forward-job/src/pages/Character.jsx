import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../utils/api";
import logo from "../images/Logo.PNG";
import "../css/character.css";

function Character() {
    const [users, setUsers] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [error, setError] = useState("");
    const [slideDir, setSlideDir] = useState("none");

    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                // Get all users data from backend
                // users = array of character objects from backend
                const response = await api.get("/users");
                setUsers(response.data);
            } catch (err) {
                console.log("Get users error: ", err);
                setError("Cannot load characters. Is backend running?");
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    // repeat the array
    const getUserAt = (i) => {
        if (users.length === 0) return null;
        const safeIndex = (i + users.length) % users.length;
        return users[safeIndex];
    };

    /**
     * Index is the current index of the Character
     * currrent is xianzai Character - users[1]
     * preUSer is 左边Character - users[0]
     * nextUSer is 右边Character - users[2]
     */
    const current = getUserAt(index);
    const prevUser = getUserAt(index - 1);
    const nextUser = getUserAt(index + 1);

    /**
     * current.image
     * because "current" is not just a string , is an object
     */

    const goPrev = () => {
        if (users.length === 0) return;
        setSlideDir("right");
        setIndex((i) => (i === 0 ? users.length - 1 : i - 1));
    };

    const goNext = () => {
        if (users.length === 0) return;
        setSlideDir("left");
        setIndex((i) => (i === users.length - 1 ? 0 : i + 1));
    };

    const goByRole = (user) => {
        const { role, characterName } = user;

        if (role === "student" || role === "teacher") {
            navigate("/classroom", { state: { characterName, role } });
            return;
        }

        if (role === "office") {
            navigate("/office", { state: { characterName, role } });
            return;
        }

        if (role === "admin") {
            navigate("/meetingroom1", { state: { characterName, role } });
            return;
        }

        if (role === "mike") {
            navigate("/map", { state: { characterName, role } });
            return;
        }

        navigate("/map", { state: { characterName, role } });
    };

    const handleSelect = async () => {
        if (!current) return;

        setSelecting(true);
        setError("");

        try {
            const response = await api.post("/users/select-character", {
                userId: current._id,
            });

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            console.log("Select character ok: ", response.data);
            goByRole(response.data.user);
        } catch (err) {
            console.log("Select character error: ", err);
            setError("Select failed. Please try again.");
        } finally {
            setSelecting(false);
        }
    };

    if (loading) {
        return (
            <div className="character-page">
                <p className="character-loading">Loading characters...</p>
            </div>
        );
    }

    return (
        <div className="character-page">
            <img className="character-logo" src={logo} alt="Forward College Logo" />

            {/* If no character show error message , if got show something */}
            {users.length === 0 ? (
                <p className="character-error">No Character</p>
            ) : (
                <div className="carousel">
                    <div className={`carousel-stage slide-${slideDir}`} key={index}>
                        {/* left Card */}
                        {prevUser && (
                            <div className="carousel-card side left" style={{ backgroundImage: `url(${prevUser.image})` }}>
                                <div className="card-overlay">
                                    <h2>{prevUser.characterName}</h2>
                                </div>
                            </div>
                        )}

                        {/* Middle Card ( Active ) */}
                        <div className="carousel-card active" style={{ backgroundImage: `url(${current.image})` }}>
                            <div className="card-overlay">
                                <h2>{current.characterName}</h2>
                                <p className="role">{current.role}</p>
                                <button className="select-btn" type="button" onClick={handleSelect} disabled={selecting}>
                                    {selecting ? "Selecting..." : "Select"}
                                </button>
                            </div>
                        </div>

                        {nextUser && (
                            <div className="carousel-card side right" style={{ backgroundImage: `url(${nextUser.image})` }}>
                                <div className="card-overlay">
                                    <h2>{nextUser.characterName}</h2>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="carousel-arrows">
                        <button className="arrow-btn" type="button" onClick={goPrev}>
                            ←
                        </button>
                        <button className="arrow-btn" type="button" onClick={goNext}>
                            →
                        </button>
                    </div>
                </div>
            )}

            {error && <p className="character-error">{error}</p>}
        </div>
    );
}

export default Character;
