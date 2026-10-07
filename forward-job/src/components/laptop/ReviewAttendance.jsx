import { useState, useEffect } from "react";
import api from "../../utils/api";

// Office (Ms Kher Nee) review / edit attendance
function ReviewAttendance() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const getRecords = async () => {
        try {
            const userToken = localStorage.getItem("token");
            const response = await api.get("/attendance", {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            });
            setRecords(response.data);
        } catch (err) {
            console.log("Get attendance error: ", err);
            setError("Cannot load attendance.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRecords();
    }, []);

    const handleUpdate = async (id, status) => {
        setMessage("");

        try {
            const userToken = localStorage.getItem("token");
            await api.patch(
                `/attendance/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
            setMessage("Updated.");
            getRecords();
        } catch (err) {
            console.log("Update attendance error: ", err);
            setMessage("Update failed.");
        }
    };

    if (loading) return <p className="laptop-note">Loading attendance...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    return (
        <div className="fcn-panel">
            <h4>Review Attendance</h4>
            <p className="fcn-hint">Check and edit the records teachers marked.</p>

            {records.length === 0 ? (
                <p className="laptop-note">No attendance record yet.</p>
            ) : (
                <ul className="attendance-list">
                    {records.map((record) => (
                        <li key={record._id}>
                            <div className="review-main">
                                <span>{record.student?.characterName}</span>
                                <span className="review-meta">
                                    by {record.markedBy?.characterName || "-"}
                                </span>
                            </div>
                            <select
                                value={record.status}
                                onChange={(e) => handleUpdate(record._id, e.target.value)}
                            >
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                            </select>
                        </li>
                    ))}
                </ul>
            )}

            {message && <p className="form-note">{message}</p>}
        </div>
    );
}

export default ReviewAttendance;
