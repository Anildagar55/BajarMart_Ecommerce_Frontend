import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios.js";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const token = params.get("token");
console.log("Token =", token);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await api.post("/users/reset-password", {
                token,
                password: newPassword
            });

            alert("Password changed successfully");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data || "Reset failed");
        }
    };

    return (
        <div className="container mt-5" style={{maxWidth:"450px"}}>
            <div className="card p-4">

                <h3 className="text-center mb-4">
                    Reset Password
                </h3>

                <form onSubmit={handleSubmit}>

                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e)=>setNewPassword(e.target.value)}
                    />

                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />

                    <button
                        className="btn btn-success w-100"
                        type="submit">
                        Reset Password
                    </button>

                </form>

            </div>
        </div>
    );
}