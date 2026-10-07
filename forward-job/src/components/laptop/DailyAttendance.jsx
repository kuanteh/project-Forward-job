import { useState, useEffect } from "react";
import api from "../../utils/api";

// Teacher (Sir Paul) mark student attendance for today
function DailyAttendance() {
    const [students, setStudents] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await api.get("/users?role=student");
                setStudents(response.data);

                const startMap = {};
                response.data.forEach((student) => {
                    startMap[student._id] = "present";
                });
                setStatusMap(startMap);
            } catch (err) {
                console.log("Get students error: ", err);
                setError("Cannot load students.");
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    const handleStatusChange = (studentId, status) => {
        setStatusMap({ ...statusMap, [studentId]: status });
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            const userToken = localStorage.getItem("token");
            const today = new Date().toISOString().slice(0, 10);

            for (const student of students) {
                await api.post(
                    "/attendance",
                    {
                        student: student._id,
                        date: today,
                        status: statusMap[student._id] || "present",
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                );
            }

            setMessage("Attendance saved.");
        } catch (err) {
            console.log("Save attendance error: ", err);
            setMessage("Save failed.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="laptop-note">Loading students...</p>;
    if (error) return <p className="laptop-note error">{error}</p>;

    return (
        <div className="fcn-panel">
            <h4>Daily Attendance</h4>
            <p className="fcn-hint">Mark each student for today.</p>

            {students.length === 0 ? (
                <p className="laptop-note">No student yet.</p>
            ) : (
                <ul className="attendance-list">
                    {students.map((student) => (
                        <li key={student._id}>
                            <span>{student.characterName}</span>
                            <select
                                value={statusMap[student._id] || "present"}
                                onChange={(e) => handleStatusChange(student._id, e.target.value)}
                            >
                                <option value="present">Present</option>
                                <option value="late">Late</option>
                                <option value="absent">Absent</option>
                            </select>
                        </li>
                    ))}
                </ul>
            )}

            <button className="fcn-btn" type="button" onClick={handleSave} disabled={saving || students.length === 0}>
                {saving ? "Saving..." : "Save Attendance"}
            </button>

            {message && <p className="form-note">{message}</p>}
        </div>
    );
}

export default DailyAttendance;
