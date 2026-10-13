import { useState, useEffect } from "react";
import api from "../../utils/api";

// Teacher mark one student for a date
function DailyAttendance() {
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [status, setStatus] = useState("present");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await api.get("/users?role=student");
                setStudents(response.data);
                if (response.data.length > 0) {
                    setStudentId(response.data[0]._id);
                }
            } catch (err) {
                console.log("Get students error: ", err);
                setError("Cannot load students.");
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const userToken = localStorage.getItem("token");
            await api.post(
                "/attendance",
                {
                    student: studentId,
                    date,
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );
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
            <p className="fcn-hint">Pick a date and a student, then save the status.</p>

            {students.length === 0 ? (
                <p className="laptop-note">No student yet.</p>
            ) : (
                <form className="teacher-form" onSubmit={handleSave}>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>
                                {student.characterName}
                            </option>
                        ))}
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="present">Present</option>
                        <option value="late">Late</option>
                        <option value="absent">Absent</option>
                    </select>
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                    {message && <p className="form-note">{message}</p>}
                </form>
            )}
        </div>
    );
}

export default DailyAttendance;
