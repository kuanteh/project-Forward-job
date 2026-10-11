import { useState, useEffect } from "react";
import api from "../../utils/api";

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [characterName, setCharacterName] = useState("");
    const [image, setImage] = useState("");
    const [editingId, setEditingId] = useState("");
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

    const clearForm = () => {
        setName("");
        setEmail("");
        setCharacterName("");
        setImage("");
        setRole("student");
        setEditingId("");
    };

    const handleEdit = (user) => {
        setEditingId(user._id);
        setName(user.name);
        setEmail(user.email);
        setCharacterName(user.characterName || "");
        setImage(user.image || "");
        setRole(user.role);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const userToken = localStorage.getItem("token");
        const body = { name, email, role, characterName, image };

        try {
            if (editingId) {
                await api.patch(`/users/${editingId}`, body, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setMessage("User updated.");
            } else {
                await api.post("/users", body, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setMessage("User created.");
            }

            clearForm();
            getUsers();
        } catch (err) {
            console.log("Save user error: ", err);
            setMessage(err.response?.data?.error || "Save failed.");
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
            if (editingId === id) clearForm();
            getUsers();
        } catch (err) {
            console.log("Delete user error: ", err);
            setMessage(err.response?.data?.error || "Delete failed.");
        }
    };

    if (loading) return <p className="laptop-note">Loading users...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    const editingUser = users.find((user) => user._id === editingId);
    const lockRole = editingUser?.isProtected;

    return (
        <div className="fcn-panel">
            <h4>Manage Users</h4>
            <p className="fcn-hint">Total users: {users.length}</p>

            <form className="teacher-form" onSubmit={handleSubmit}>
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
                    required
                />
                <input
                    type="text"
                    placeholder="Image /image/xxx.png"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} disabled={lockRole}>
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="office">office</option>
                    <option value="admin">admin</option>
                </select>
                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update User" : "Create User"}
                </button>
                {editingId && (
                    <button type="button" className="cancel-edit-btn" onClick={clearForm}>
                        Cancel
                    </button>
                )}
            </form>

            <ul className="attendance-list manage-list">
                {users.map((user) => (
                    <li key={user._id}>
                        <div className="review-main">
                            <span>{user.characterName || user.name}</span>
                            <span className="review-meta">{user.role}{user.isProtected ? " · core" : ""}</span>
                        </div>
                        <div className="manage-actions">
                            <button className="edit-btn" type="button" onClick={() => handleEdit(user)}>
                                Edit
                            </button>
                            {!user.isProtected && (
                                <button className="delete-btn" type="button" onClick={() => handleDelete(user._id)}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {message && <p className="form-note">{message}</p>}
        </div>
    );
}

export default ManageUsers;
