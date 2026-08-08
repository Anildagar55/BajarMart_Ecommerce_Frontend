import { useState } from "react";
import api from "../../../api/axios";
export default function ForgotPassword() {

    const [email,setEmail]=useState("");
    const [message,setMessage]=useState("");

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{

            await api.post("/users/forgot-password",{
                email
            });
    alert("Reset Link Sent");

            setMessage("Password reset link has been sent to your email.");

        }catch(err){

            setMessage("Unable to send reset link.");
        }
    }

    return(

        <div className="max-w-md mx-auto py-20">

            <div className="bg-white border rounded-lg p-8">

                <h2 className="text-xl font-bold mb-5">
                    Forgot Password
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        className="w-full border rounded px-3 py-2 mb-4"
                    />

                    <button
                        className="w-full bg-red-500 text-white py-2 rounded"
                    >
                        Send Reset Link
                    </button>

                </form>

                {message && <p className="mt-4">{message}</p>}

            </div>

        </div>
    );
}