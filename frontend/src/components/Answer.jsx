import React, { useState } from 'react'
import { SlArrowDown } from 'react-icons/sl';
import { AnswerLine } from './AnswerLine';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineContentCopy } from 'react-icons/md';
import { parseResponse } from '../utils/helper';

export default function Answer({ answer, status, isLast }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (isCopied) return;
            await navigator.clipboard.writeText(answer);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, 3000);
        } catch (error) {
            toast.error("failed to copy.");
        }
    }

    return (
        <div className={`${isOpen? "mb-4" : "mb-12"}`}>
            {status === "generating" &&
                <div className="h-[60vh] text-zinc-400 animate-dots">
                    Answering
                    <span className="dot-1">.</span>
                    <span className="dot-2">.</span>
                    <span className="dot-3">.</span>
                </div>}
            {(status === "ready" || status === "editing") && <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center p-3
                        hover:bg-zinc-800
                        text-zinc-200 hover:text-white
                        text-sm font-semibold
                        rounded-full shadow-sm transition-all duration-200
                        select-none
                        ${!isOpen ? "bg-zinc-800" : ""}`}
                >
                    <span
                        className={`transform transition-transform duration-300 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                    >
                        <SlArrowDown />
                    </span>
                </button>
                {isOpen && <div className="whitespace-normal">
                    {answer && (
                        parseResponse(answer).map((item, index) => (
                            <div key={index}>
                                <AnswerLine
                                    ansType={item.type}
                                    ans={item.content}
                                    language={
                                        item.type.trim() === 'code'
                                            ? item.language
                                            : ''
                                    }
                                />
                            </div>
                        )))}
                    <div>
                        <button
                            type="button"
                            className="p-2 cursor-pointer"
                            onClick={handleCopy}
                        >
                            {isCopied ? <FaCheck /> : <MdOutlineContentCopy />}
                        </button>
                    </div>
                </div>}
            </div>
            }
            {
                status === "error" && <div className="max-w-full text-red-500 pt-4 pb-2 whitespace-normal">
                    Something went wrong!!
                </div>
            }
        </div >
    )
}
