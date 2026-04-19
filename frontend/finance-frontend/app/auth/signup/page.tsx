"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function Signup() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSignup = async () => {

        await axios.post("http://127.0.0.1:8000/signup", {
            email,
            password
        })

        alert("Signup successful!")

        router.push("/auth/login")
    }

    return (
        <div style={{ padding: "40px" }}>

            <h1>Signup</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleSignup}>
                Signup
            </button>

        </div>
    )
}