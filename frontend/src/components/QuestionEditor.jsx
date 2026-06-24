import { useState, useContext, useRef } from "react";
import { ChatContext } from "../app/context/Context";
import { toast } from "react-toastify";
import { Edit_Question_API } from "../constants/env";

export default function QuetionEditor({ index, defaultValue }) {
    const textareaRef = useRef();

    const { chat,
        setChat,
        isLoadingAns,
        isLoggedIn,
        setIsLoggedIn,
        setIsLoadingAns } = useContext(ChatContext);

    const handleCancel = () => {
        setChat(prev =>
            prev.map((item, i) => {
                if (i !== index) return item;

                const versions = item.versions.map((v, vi) =>
                    vi === item.curr_version
                        ? { ...v, status: "ready" }
                        : v
                );

                return { ...item, versions };
            })
        );
    }

    const handleSend = async () => {
        if (!isLoggedIn) toast.warn("Please login to continue");
        const question = textareaRef.current.value.trim();
        if (!question || isLoadingAns) return;

        setIsLoadingAns(true)
        setChat(prev =>
            prev.map((item, i) => {

                if (i !== index) return item;

                const versions = [...item.versions];
                versions[item.curr_version].status = "ready";
                versions.push({
                        question,
                        answer: "",
                        status: "generating"
                });

                return {
                    ...item,
                    versions,
                    curr_version: versions.length - 1
                }
            })
        );

        const token = localStorage.getItem("token");
        const chatId = chat[index]?.chatId;
        let answer;
        try {
            const res = await fetch(Edit_Question_API, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify({ chatId, question })
            });

            if (res.status === 401) {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                toast.warn("Please login to continue");
                return;
            }

            if (!res.ok) {
                throw new Error("Could not generate response");
            }

            const data = await res.json();

            if (data?.answer) {
                answer = data.answer || "";
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setChat(prev =>
                prev.map((item, i) => {
                    if (i !== index) return item;

                    const versions = item.versions.map((v, vi) =>
                        vi === item.curr_version
                            ? {
                                ...v,
                                answer,
                                status: answer ? "ready" : "error"
                            }
                            : v
                    );

                    return { ...item, versions };
                })
            );
            setIsLoadingAns(false);
        }
    }


    return (
        <>
            <p className="text-right text-sm my-1">({index + 1}/{chat.length})</p>
            <div className="max-w-[75vw] min-w-[50vw] w-fit h-fit ml-auto bg-zinc-800 p-3 rounded-2xl rounded-tr-none whitespace-normal">
                <textarea
                    ref={textareaRef}
                    defaultValue={defaultValue}
                    rows={1}
                    className={
                        `w-full h-full min-h-[2.5rem]
                    resize-none 
                    outline-none
                    focus:outline-none
                    bg-transparent
                    overflow-y-auto 
                    scroll-invisible`
                    }
                ></textarea>
                <div className='ml-auto flex gap-2 justify-end'>
                    <button
                        className='px-1 text-sm rounded-lg border-1 border-zinc-300'
                        onClick={handleCancel}
                    >cancel</button>
                    <button
                        className='px-1 text-sm rounded-lg bg-zinc-300 text-zinc-900'
                        onClick={handleSend}
                        disabled={isLoadingAns}
                    >send</button>
                </div>
            </div>
        </>
    )
}
