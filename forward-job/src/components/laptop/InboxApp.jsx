import { useState, useEffect } from "react";
import api from "../../utils/api";

// Everyone can read own inbox. Staff / student can also send letter.
function InboxApp() {
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const canSend = ["student", "teacher", "office", "admin"].includes(savedUser.role);

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [openMessage, setOpenMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [toId, setToId] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("normal");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState("");

    useEffect(() => {
        const getInbox = async () => {
            try {
                const userToken = localStorage.getItem("token");
                if (userToken == null) throw new Error("User Token is unavailable");

                // no need pass ?to= , the backend already filter by the token user
                const response = await api.get("/inbox", {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                });
                setMessages(response.data);

                if (canSend) {
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

        getInbox();
    }, []);

    const handleOpen = async (msg) => {
        setOpenMessage(msg);

        if (msg.isRead) return;

        // mark as read , and update the list on the left side also
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

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        setSent("");

        try {
            await api.post(
                "/inbox",
                { to: toId, subject, message, type },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setSent("Letter sent.");
            setSubject("");
            setMessage("");
            setToId("");
            setType("normal");
        } catch (err) {
            console.log("Send letter error: ", err);
            setSent("Send failed.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <p className="laptop-note">Loading inbox...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    return (
        <div className="laptop-app">
            <div className="app-bar">
                <span className="app-title">Inbox</span>
                <span className="app-count">{messages.filter((item) => !item.isRead).length} unread</span>
            </div>

            <div className={canSend ? "inbox-body with-compose" : "inbox-body"}>
                <ul className="inbox-list">
                    {messages.length === 0 ? (
                        <li>
                            <p className="laptop-note">No message for you.</p>
                        </li>
                    ) : (
                        messages.map((msg) => (
                            <li key={msg._id}>
                                <button
                                    type="button"
                                    className={openMessage?._id === msg._id ? "inbox-row open" : "inbox-row"}
                                    onClick={() => handleOpen(msg)}
                                >
                                    {!msg.isRead && <span className="unread-dot" />}
                                    <span className="inbox-subject">{msg.subject}</span>
                                    <span className="inbox-from">{msg.from?.characterName}</span>
                                </button>
                            </li>
                        ))
                    )}
                </ul>

                <div className="inbox-reader">
                    {openMessage ? (
                        <>
                            <h4>{openMessage.subject}</h4>
                            <p className="reader-meta">
                                From {openMessage.from?.characterName} · {openMessage.type}
                            </p>
                            <p className="reader-text">{openMessage.message}</p>
                        </>
                    ) : (
                        <p className="laptop-note">Click a message to read it.</p>
                    )}
                </div>

                {canSend && (
                    <form className="teacher-form inbox-compose" onSubmit={handleSend}>
                        <h4>Send Letter</h4>
                        <select value={toId} onChange={(e) => setToId(e.target.value)} required>
                            <option value="">Select user</option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.characterName} ({user.role})
                                </option>
                            ))}
                        </select>

                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="normal">normal</option>
                            <option value="tuition">tuition</option>
                            <option value="warning">warning</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />

                        <textarea
                            rows="3"
                            placeholder="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />

                        <button type="submit" disabled={sending}>
                            {sending ? "Sending..." : "Send"}
                        </button>

                        {sent && <p className="form-note">{sent}</p>}
                    </form>
                )}
            </div>
        </div>
    );
}

export default InboxApp;
