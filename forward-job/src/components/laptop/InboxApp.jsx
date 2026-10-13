import { useState, useEffect } from "react";
import api from "../../utils/api";
import "../../css/inbox.css";

// Everyone can read own inbox. Staff / student can also send letter.
function InboxApp() {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const canSend = ["student", "teacher", "office", "admin", "mike"].includes(savedUser.role);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [openMessage, setOpenMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCompose, setShowCompose] = useState(false);
    const [folder, setFolder] = useState("inbox"); // inbox = received , sent = i wrote
    const [editingId, setEditingId] = useState("");

    const [toId, setToId] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState("");

    const getInbox = async (box = folder) => {
        try {
            const userToken = localStorage.getItem("token");
            if (userToken == null) throw new Error("User Token is unavailable");

            const response = await api.get(`/inbox?box=${box}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setMessages(response.data);

            if (canSend && users.length === 0) {
                const userRes = await api.get("/users");
                // do not send to yourself
                setUsers(userRes.data.filter((user) => user._id !== savedUser._id));
            }
        } catch (err) {
            console.log("Get inbox error: ", err);
            setError("Cannot load inbox. Is backend running?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getInbox(folder);
        setOpenMessage(null);
    }, [folder]);

    const handleOpen = async (msg) => {
        setOpenMessage(msg);

        // only mark received letters as read
        if (folder === "sent" || msg.isRead) return;

        try {
            await api.patch(
                `/inbox/${msg._id}`,
                { isRead: true },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setMessages(messages.map((item) => (item._id === msg._id ? { ...item, isRead: true } : item)));
        } catch (err) {
            console.log("Mark read error: ", err);
        }
    };

    const closeCompose = () => {
        setShowCompose(false);
        setEditingId("");
        setSent("");
        setToId("");
        setSubject("");
        setMessage("");
    };

    const handleEdit = (msg) => {
        setEditingId(msg._id);
        setToId(msg.to?._id || "");
        setSubject(msg.subject);
        setMessage(msg.message);
        setSent("");
        setShowCompose(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/inbox/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMessages(messages.filter((item) => item._id !== id));
            if (openMessage?._id === id) setOpenMessage(null);
        } catch (err) {
            console.log("Delete letter error: ", err);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setSent("");

        const userToken = localStorage.getItem("token");

        try {
            if (editingId) {
                await api.patch(
                    `/inbox/${editingId}`,
                    { subject, message },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                setSent("Letter updated.");
            } else {
                await api.post(
                    "/inbox",
                    { to: toId, subject, message },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
                setSent("Letter sent.");
            }

            setSubject("");
            setMessage("");
            setToId("");
            setEditingId("");
            setShowCompose(false);
            getInbox(folder);
        } catch (err) {
            console.log("Send letter error: ", err);
            setSent(editingId ? "Update failed." : "Send failed.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <p className="laptop-note">Loading inbox...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    return (
        <div className="laptop-app inbox-app">
            <div className="app-bar">
                <span className="app-title">Inbox</span>
            </div>

            <div className="inbox-body">
                <div className="inbox-left">
                    {canSend && (
                        <button type="button" className="compose-btn" onClick={() => setShowCompose(true)}>
                            Write Inbox
                        </button>
                    )}

                    <div className="inbox-folders">
                        <button
                            type="button"
                            className={folder === "inbox" ? "folder-btn active" : "folder-btn"}
                            onClick={() => setFolder("inbox")}
                        >
                            Received
                        </button>
                        <button
                            type="button"
                            className={folder === "sent" ? "folder-btn active" : "folder-btn"}
                            onClick={() => setFolder("sent")}
                        >
                            Sent
                        </button>
                    </div>

                    <ul className="inbox-list">
                    {messages.length === 0 ? (
                        <li>
                            <p className="laptop-note">
                                {folder === "sent" ? "No sent message." : "No message for you."}
                            </p>
                        </li>
                    ) : (
                        messages.map((msg) => (
                            <li key={msg._id}>
                                <button
                                    type="button"
                                    className={openMessage?._id === msg._id ? "inbox-row open" : "inbox-row"}
                                    onClick={() => handleOpen(msg)}
                                >
                                    {folder === "inbox" && !msg.isRead && <span className="unread-dot" />}
                                    <span className="inbox-subject">{msg.subject}</span>
                                    <span className="inbox-from">
                                        {folder === "sent"
                                            ? `To ${msg.to?.characterName}`
                                            : msg.from?.characterName}
                                    </span>
                                </button>
                            </li>
                        ))
                    )}
                    </ul>
                </div>

                <div className="inbox-reader">
                    {openMessage ? (
                        <>
                            <h4>{openMessage.subject}</h4>
                            <p className="reader-meta">
                                {folder === "sent"
                                    ? `To ${openMessage.to?.characterName}`
                                    : `From ${openMessage.from?.characterName}`}
                            </p>
                            <p className="reader-text">{openMessage.message}</p>

                            {folder === "sent" && (
                                <div className="sent-actions">
                                    <button type="button" className="edit-letter-btn" onClick={() => handleEdit(openMessage)}>
                                        Edit
                                    </button>
                                    <button type="button" className="delete-letter-btn" onClick={() => handleDelete(openMessage._id)}>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="laptop-note">Click a message to read it.</p>
                    )}
                </div>
            </div>

            {showCompose && (
                <div className="compose-overlay" onClick={closeCompose}>
                    <form
                        className="compose-modal"
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleSend}
                    >
                        <h4>{editingId ? "Edit Message" : "New Message"}</h4>
                        <select
                            value={toId}
                            onChange={(e) => setToId(e.target.value)}
                            required
                            disabled={Boolean(editingId)}
                        >
                            <option value="">Select user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.characterName} ({user.role})
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                        <textarea
                            rows="5"
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={sending}>
                            {sending ? "Saving..." : editingId ? "Update" : "Send"}
                        </button>
                        <button type="button" className="compose-cancel" onClick={closeCompose}>
                            Cancel
                        </button>
                        {sent && <p className="form-note">{sent}</p>}
                    </form>
                </div>
            )}
        </div>
    );
}

export default InboxApp;
