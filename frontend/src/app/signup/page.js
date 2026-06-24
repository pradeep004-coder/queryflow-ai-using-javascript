'use client'
import { useRouter } from 'next/navigation';
import { useContext, useRef, useState } from 'react'
import { ChatContext } from "../context/Context";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Signup_API } from '@/src/constants/env';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Singup() {
    const [isSigning, setIsSigning] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { chat, setChat, setIsLoggedIn } = useContext(ChatContext);
    const emailRef = useRef();
    const nameRef = useRef();
    const passRef = useRef();
    const router = useRouter();
    const emailRegex = /[a-zA-Z0-9+-_.%]+@[^\s@]+\.[a-z]{2,}$/;
    const nameRegex = /[a-zA-Z\s']+$/;

    const capitalize = (str) => {
        const capitalizedName = str.split(' ').map((item => {
            return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
        }))
        return capitalizedName.join(' ');
    }

    const handleEmailInput = (e) => {
    e.target.value = e.target.value.toLowerCase();
}

    
        const togglePasswordVisibility = (e) => {
            e.preventDefault();
            setShowPassword(!showPassword);
        }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value.trim();
        const name = capitalize(nameRef.current.value.trim());
        const password = passRef.current.value.trim();

        if (!name) return toast.warning("Enter name!!");
        if (!nameRegex.test(name)) return toast.warning("Invalid name!!");
        if (!name.includes(" ")) return toast.warning("Enter full name")
        if (name.length < 5) return toast.warning("Name must be atleast 5 characters long!!");
        if (!email) return toast.warning("Enter email!!");
        if (!emailRegex.test(email)) return toast.warning("Invalid email!!");
        if (email.includes(" ")) return toast.warning("Email should not contain whitespace!!");
        if (!password) return toast.warning("Enter password!!");
        if (password.includes(" ")) return toast.warning("Password should not contain whitespace!!");
        if (password.length < 6) return toast.warning("Password must be atleast 6 characters long!!");

        if (
            !isSigning &&
            email.length > 0 &&
            password.length > 5
        ) {
            setIsSigning(true);

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

            const body = {
                name,
                email,
                password,
                availableChats
            };

            try {
                const res = await fetch(Signup_API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });

                if (res.status === 409) {
                    toast.error("User already exists!! login instead");
                    return;
                }
                if (!res.ok) {
                    throw new Error("Something went wrong!!")
                }

                const data = await res.json();

                if (data?.token) {
                    localStorage.setItem("token", data.token);
                    setIsLoggedIn(true);
                    toast.success("Signup successful!");
                    setTimeout(() => router.push("/"), 500);
                } else {
                    throw new Error("Token is missing");
                }

                setChat([]);

            } catch (error) {
                toast.error("Signup went wrong!!");
                console.error(error);
            } finally {
                setIsSigning(false);
            }
        }
    }

    return (
        <div className='h-screen w-full bg-zinc-200 text-black fixed'>
            <form className='w-[80%] max-w-[400px] mx-auto mt-[20vh]' onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                    <label>Full Name*:</label>
                    <input className='border-1 p-1 px-2 rounded-md' placeholder=" enter your name" ref={nameRef} />
                </div>
                <div className="flex flex-col mb-4">
                    <label>Email address*:</label>
                    <input className='border-1 p-1 px-2 rounded-md' placeholder=" enter email" ref={emailRef} onInput={handleEmailInput} />
                </div>
                <div className="flex flex-col">
                    <label>Password*:</label>
                    <div className="flex gap-2 border-1 rounded-md">
                        <input type={showPassword ? "text" : "password"} placeholder=" create password" className='flex-grow outine-none focus:outline-none py-1 px-2' ref={passRef} />
                        <button onClick={(e) => togglePasswordVisibility(e)} className='px-2 cursor-pointer'>
                            {showPassword ?
                                <FaRegEyeSlash />
                                : <FaRegEye />}
                        </button>
                    </div>
                </div>
                <div className='flex flex-col justify-center mt-5'>
                    <button type='submit' className={`px-2 py-1 text-zinc-100 font-bold rounded-lg cursor-pointer ${isSigning ? "bg-zinc-400" : "bg-zinc-600 hover:bg-zinc-500"}`} disabled={isSigning}>
                        {isSigning ? <ClipLoader
                            color="grey"
                            loading={isSigning}
                            size={12}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                            : "Create Account"}
                    </button>
                    <small className='text-center'>Already have an account?<Link href='/login' className='text-blue-800'>Login</Link></small>
                </div>
            </form>
        </div>
    )
}