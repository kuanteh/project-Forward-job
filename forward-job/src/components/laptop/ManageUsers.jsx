import { useState, useEffect } from "react";
import api from "../../utils/api";

// Admin (Sir Howie) manage users
function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [characterName, setCharacterName] = useState("");
    const [saving, setSaving] = useState(false);

    const getUsers = async () => {
        try {
            const userToken = localStorage.getItem("token");
            const response = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setUsers(response.data);
        } catch (err) {
            console.log("Get users error: ", err);
            setError("Cannot load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const userToken = localStorage.getItem("token");
            await api.post(
                "/users",
                {
                    name,
                    email,
                    role,
                    characterName: characterName || name,
                    image: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            setMessage("User created.");
            setName("");
            setEmail("");
            setCharacterName("");
            setRole("student");
            getUsers();
        } catch (err) {
            console.log("Create user error: ", err);
            setMessage("Create failed.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        setMessage("");

        try {
            const userToken = localStorage.getItem("token");
            await api.delete(`/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setMessage("User deleted.");
            getUsers();
        } catch (err) {
            console.log("Delete user error: ", err);
            setMessage("Delete failed.");
        }
    };

    if (loading) return <p className="laptop-note">Loading users...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    return (
        <div className="fcn-panel">
            <h4>Manage Users</h4>
            <p className="fcn-hint">Total users: {users.length}</p>

            <form className="teacher-form" onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Character name"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="office">office</option>
                    <option value="admin">admin</option>
                    <option value="mike">mike</option>
                </select>
                <button type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create User"}
                </button>
            </form>

            <ul className="attendance-list manage-list">
                {users.map((user) => (
                    <li key={user._id}>
                        <div className="review-main">
                            <span>{user.characterName || user.name}</span>
                            <span className="review-meta">{user.role}</span>
                        </div>
                        <button className="delete-btn" type="button" onClick={() => handleDelete(user._id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {message && <p className="form-note">{message}</p>}
        </div>
    );
}

export default ManageUsers;
