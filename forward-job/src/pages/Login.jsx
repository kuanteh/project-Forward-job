import { useState, useEffect } from "react";
import "./login.css";
// import axios from "axios";
// import api from "../utils/api";
import { useNavigate } from "react-router";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // if you already have the token , so directlt go to products page
    useEffect(() => {
        const userToken = localStorage.getItem("token");
        console.log(userToken);
        if (userToken !== null) navigate("/products");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 💡 Add your login / authentication logic here
        console.log("Form submitted:", { email, password });
        try {
            // in the {email,password} thats mean body in PostMan
            // axios change to "api"
            const response = await api.post("/users/login", {
                email,
                password,
            });
            // localstorage only store string , response.data is object
            // respone.data 就是你login 拿到的 token (object)
            // respone.data.token : just take the token only
            localStorage.setItem("token", response.data.token);
            navigate("/Products");
            console.log("Login successful: ", response.data);
            alert("Login Successful!");
        } catch (error) {
            console.log("Login Error: ", error);
        }
    };

    return (
        <div className="login-wrapper">
            <form onSubmit={handleSubmit} className="login-card">
                <h2>Welcome Back</h2>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                </div>

                <button type="submit" className="login-btn">
                    Sign In
                </button>
                <button className="register-btn" type="button" style={{ marginTop: "12px" }} onClick={() => navigate("/register")}>
                    No account? Sign up here!
                </button>
            </form>
        </div>
    );
}

export default Login;
