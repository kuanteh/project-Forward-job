import { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 💡 Add your sign up / authentication logic here
        console.log("Form submitted:", { email, password });
        try {
            const response = await axios.post("http://localhost:3000/users/register", {
                email,
                password,
            });
            console.log("Register successful: ", response.data);
            alert("Register Successful!");
        } catch (error) {
            console.log("Register Error: ", error);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Welcome Register Frist !!!!!</h2>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>

                <button type="submit" className="login-btn">
                    Sign Up
                </button>

                <button className="register-btn" type="button" style={{ marginTop: "12px" }} onClick={() => navigate("/")}>
                    Already have an account? Sign in here
                </button>
            </form>
        </div>
    );
}

export default SignUp;
