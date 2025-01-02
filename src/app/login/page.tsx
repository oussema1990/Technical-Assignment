"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import  texts  from "../../locales/en.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


export default function LoginPage() {

    const { login } = useUser();
    const router = useRouter();
    console.log(login)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(email, password)) {
            router.push("/dashboard"); // Redirect after login to dashboard page
        } else {
            setError(texts.login.error);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-md w-96 login-form relative overflow-hidden rounded-3xl">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
                    {texts.login.title}
                </h1>
                <form className="relative z-10" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block font-bold mb-1">
                            {texts.login.mail}
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block font-bold mb-1">
                            {texts.login.pwd}
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border px-4 py-2 rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        {texts.login.btnLogin}
                    </button>
                </form>
            </div>
        </div>
    );
}
