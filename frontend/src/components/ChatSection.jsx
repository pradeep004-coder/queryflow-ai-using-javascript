'use client'
import { useState, useContext, useEffect, useRef } from "react";
import { ClipLoader } from "react-spinners";
import Question from "./Question";
import { toast } from "react-toastify";
import DateBadge from "./DateBadge";
import { ChatContext } from "../app/context/Context.js";
import { Get_Chats_API } from "../constants/env";
import { AnimatePresence, motion } from "framer-motion";
import { GoArrowDown } from "react-icons/go";
import Answer from "./Answer";
import QuetionEditor from "./QuestionEditor";

function ChatSection({ elementsRef }) {

    const {
        chat,
        setChat,
        isLoggedIn,
        setIsLoggedIn,
        canLoadMore,
        setCanLoadMore,
        isLoadingChats,
        setIsLoadingChats
    } = useContext(ChatContext);

    const [daySeparators, setDaySeparators] = useState([]);
    const [visibleDate, setVisibleDate] = useState("");
    const [isDateVisible, setIsDateVisible] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const scrollContainerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const prevScrollHeightRef = useRef(0);
    const hideBtnTimeoutRef = useRef(null);
    const chatContainerRef = useRef(null);
    const visibleSetRef = useRef(new Set());

    const MILLIS_IN_DAY = 24 * 60 * 60 * 1000;

    /* -------------------- Date Helpers -------------------- */


    const toDateString = (timeString) => {
        const millis = new Date(timeString).getTime();
        const date = new Date(millis);
        const todayStart = new Date().setHours(0, 0, 0, 0);
        const currentYear = new Date().getFullYear();

        if (millis >= todayStart) return "Today";
        if (millis >= todayStart - MILLIS_IN_DAY) return "Yesterday";

        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: date.getFullYear() !== currentYear ? "numeric" : undefined
        });
    };

    /* -------------------- Visible Date Observer -------------------- */
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {
                const index = Number(entry.target.dataset.index);

                if (entry.isIntersecting) {
                    visibleSetRef.current.add(index);
                } else {
                    visibleSetRef.current.delete(index);
                }
            });
            if (!visibleSetRef.current?.size) return;
            const sorted = [...visibleSetRef.current].sort((a, b) => a - b);
            const topIndex = sorted[0];
            if (
                chat &&
                chat.length > 0 &&
                topIndex !== undefined &&
                chat[topIndex]
            ) {
                setVisibleDate(() => {
                    const date = toDateString(chat[topIndex]?.timestamp);
                    return date;
                });
            }
        }, {
            root: scrollContainerRef.current,
            rootMargin: "30px 0px 50px 0px",
        });

        elementsRef.current && elementsRef.current.forEach(element => {
            element && observer.observe(element);
        });


        return () => observer.disconnect();
    }, [chat.length]);


    /* -------------------- Day Separators -------------------- */

    useEffect(() => {
        const indices = [];

        for (let i = 0; i < chat.length; i++) {
            const currElDate = chat[i].timestamp.split('T')[0];
            const prevElDate =
                i > 0 ? chat[i - 1].timestamp.split('T')[0] : null;

            if (i === 0 || currElDate !== prevElDate) indices.push(i);
        }

        setDaySeparators(indices);
    }, [chat]);

    /* -------------------- Load More -------------------- */

    const handleLoadMore = async () => {
        if (!isLoggedIn || !canLoadMore || isLoadingChats) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const container = scrollContainerRef.current;
        if (!container) return;

        prevScrollHeightRef.current = container.scrollHeight;

        setIsLoadingChats(true);
        try {
            const response = await fetch(Get_Chats_API + `/${chat.length}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                }
            });

            if (res.status === 401) {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
                toast.warn("Please login to continue");
                return;
            }

            const data = await response.json();

            if (Array.isArray(data.chats)) {
                const optimizedChats = data.chats.map((item) => {

                    const versions = item.versions.map((v) => ({ ...v, status: "ready" }));

                    return {
                        chatId: item.chatId,
                        versions,
                        curr_version: versions.length - 1,
                        timestamp: item.timestamp
                    }
                });

                setChat([...chat, ...optimizedChats]);
                setCanLoadMore(data.canLoadMore);
            }

        } catch (err) {
            console.error("Unable to load chats:", err);
        } finally {
            setIsLoadingChats(false);
        }
    }

    /* -------------------- Restore Scroll Position -------------------- */
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (prevScrollHeightRef.current) {
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;

            container.scrollTop = diff;
            prevScrollHeightRef.current = 0;
        }
    }, [chat]);

    /* -------------------- Date Badge Visibility -------------------- */

    const handleShowDateBadge = () => {
        setIsDateVisible(true);

        if (scrollTimeoutRef.current)
            clearTimeout(scrollTimeoutRef.current);

        scrollTimeoutRef.current = setTimeout(
            () => setIsDateVisible(false),
            5000
        );
    }

    const handleScroll = () => {
        // ---Show floating date badge---
        const atTop = scrollContainerRef.current.scrollTop <= 30;
        if (atTop) setIsDateVisible(false);
        else handleShowDateBadge();

        const el = scrollContainerRef.current;
        if (!el) return;

        // -----Scroll down button-------
        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;

        if (distanceFromBottom > 100) {
            setShowScrollBtn(true);

            if (hideBtnTimeoutRef.current) {
                clearTimeout(hideBtnTimeoutRef.current);
            }

            // auto hide after user stops scrolling
            hideBtnTimeoutRef.current = setTimeout(() => {
                setShowScrollBtn(false);
            }, 1500);
        } else {
            setShowScrollBtn(false);
        }
    }

    const scrollToBottom = () => {
        if (!scrollContainerRef.current) return;

        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
        setShowScrollBtn(false);
    }


    const handleVersionChange = (value, i) => {
        let v = [...chat][i].curr_version;
        const v_limit = [...chat][i].versions.length - 1;

        if (value) {
            setChat(prev => {
                const updated = [...prev];
                updated[i].curr_version = v >= v_limit ? 0 : v + 1;
                return updated;
            });
        } else {
            setChat(prev => {
                const updated = [...prev];
                updated[i].curr_version = v <= 0 ? v_limit : v - 1;
                return updated;
            });
        }

    }



    return (
        <div
            className="flex-grow w-full bg-[#0a0a0a] pb-[140px] xl:px-[10vw] overflow-y-auto shadow-[inset_0_-4px_8px_-4px_rgba(0,0,0,0.2)] scrollbar"
            ref={scrollContainerRef}
            onScroll={handleScroll}
        >
            <div className="flex justify-center">
                {isLoggedIn && canLoadMore && chat.length > 0 && (
                    <button
                        className="bg-zinc-900 rounded-xl shadow-lg px-2 py-1"
                        onClick={handleLoadMore}
                    >
                        {isLoadingChats ? (
                            <ClipLoader size={16} color="grey" />
                        ) : (
                            "Load More"
                        )}
                    </button>
                )}
            </div>
            <DateBadge visibleDate={visibleDate} isDateVisible={isDateVisible} />

            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="mx-auto flex flex-col px-2 md:px-4 lg:px-6 pt-3 text-zinc-300"
            >
                {chat.map((chatItem, i) => (
                    <div
                        key={i}
                        data-index={i}
                        className={`${i == chat.length - 1 ? "pb-150px" : ""}`}
                        ref={(el) => (elementsRef.current[i] = el)}
                    >

                        {daySeparators.includes(i) && (
                            <div className="mx-auto text-xs w-fit py-1 px-2 bg-zinc-700 rounded-xl">
                                {toDateString(chatItem.timestamp)}
                            </div>
                        )}

                        {chatItem.versions[chatItem.curr_version].status && chatItem.versions[chatItem.curr_version].status === "editing" ?
                            <QuetionEditor
                                defaultValue={chatItem.versions[chatItem.curr_version].question}
                                index={i}
                            />
                            : <Question
                                question={chatItem.versions[chatItem.curr_version].question}
                                timestamp={chatItem.timestamp}
                                index={i}
                                active_version={chatItem.curr_version + 1}
                                onVersionChange={handleVersionChange}
                            />}

                        <Answer
                            answer={chatItem.versions[chatItem.curr_version].answer}
                            status={chatItem.versions[chatItem.curr_version].status}
                            isLast={i === chat.length - 1}
                        />

                    </div>
                ))}
            </div>
            <AnimatePresence>
                {showScrollBtn && <motion.div
                    initial={{ y: 25, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1,  scale: 1 }}
                    exit={{ y: 25, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="w-full fixed bottom-25 flex justify-center xl:-translate-x-33"
                >
                    <button className="rounded-full bg-zinc-800 text-[#0a0a0a] p-2 cursor-pointer" onClick={scrollToBottom}>
                        <GoArrowDown size={16} />
                    </button>
                </motion.div>}
            </AnimatePresence>
        </div>
    );
}

export default ChatSection;
