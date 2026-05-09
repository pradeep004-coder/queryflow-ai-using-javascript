'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { ChatContext } from "../context/Context.js";
import { ClipLoader } from 'react-spinners';
import { Login_API } from '@/src/constants/env';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Login() {
    const [isLogging, setIsLogging] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef();
    const passRef = useRef();
    const router = useRouter();
    const emailRegex = /[a-zA-Z0-9+-_.%]+@[^\s@]+\.[a-z]{2,}$/;

    const { setIsLoggedIn, chat, setChat } = useContext(ChatContext)


    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value.trim();
        const password = passRef.current.value.trim();

        if (!email) return toast.warning("Enter email!!");
        if (!emailRegex.test(email)) return toast.warning("Invalid email!!");
        if (email.includes(" ")) return toast.warning("Email should not contain whitespaces!!");
        if (!password) return toast.warning("Enter password!!");
        if (password.includes(" ")) return toast.warning("Password should not contain whitespaces!!");
        if (password.length < 6) return toast.warning("Password length must be atleast 6 characters long!!");

        if (!isLogging && email.length > 0 && password.length > 5) {
            setIsLogging(true);
            const availableChats = [...chat].map(item => {
                return {
                    versions: [...item.versions]
                        .filter(v => v.answer && v.status === "ready")
                        .map(v => ({
                            question: v.question,
                            answer: v.answer
                        })),
                    timestamp: item.timestamp
                }
            });
            try {
                const res = await fetch(Login_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password , availableChats })
                });

                if (res.status === 404) {
                    toast.warn("Email not registered!! Signup instead");
                    return;
                }
                if (res.status === 401) {
                    toast.warn("Incorrect password!!");
                    return;
                }
                if (!res.ok) {
                    throw new Error("Something went wrong");
                }

                const data = await res.json();
                console.log("data: ", data);
                if (data?.token) {
                    localStorage.setItem("token", data.token);

                    setIsLoggedIn(true);
                    toast.success("Login successful!");
                    setTimeout(() => router.push("/"), 500);
                } else {
                    toast.warn("Token is missing!!");
                }

                // clear all chats
                setChat([]);

            } catch (error) {
                toast.error("Something went wrong!!");
            } finally {
                setIsLogging(false);
            }
        }
    }

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    return (
        <div className='h-screen w-full bg-zinc-200 text-black fixed'>
            <form className='w-[80%] max-w-[400px] mx-auto mt-[20vh]' onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label>Email address*:</label>
                    <input
                        type='email'
                        placeholder=" enter email"
                        ref={emailRef}
                        className='border-1 p-1 px-2 rounded-md'
                    />
                </div>
                <div className="flex flex-col">
                    <label>Password*:</label>
                    <div className='flex gap-2 border-1 rounded-md'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder=" enter password"
                            ref={passRef}
                            className='flex-grow outline-none py-1 px-2'
                        />
                        <button onClick={(e) => togglePasswordVisibility(e)} className='px-2 cursor-pointer'>
                            {showPassword ?
                                <FaRegEyeSlash />
                                : <FaRegEye />}
                        </button>
                    </div>
                </div>
                <div className='flex flex-col justify-center mt-5'>
                    <button type='submit' className={`px-2 py-1 text-zinc-100 font-bold rounded-lg  cursor-pointer ${isLogging ? "bg-zinc-400" : "bg-zinc-600 hover:bg-zinc-500"}`} disabled={isLogging}>
                        {isLogging ? <ClipLoader
                            color="grey"
                            loading={isLogging}
                            size={12}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                            : "Login"}
                    </button>
                    <small className='text-center'>Don't have an account?<Link href="/signup" className='text-blue-800'>Create Account</Link></small>
                </div>
            </form>
        </div>
    )
}