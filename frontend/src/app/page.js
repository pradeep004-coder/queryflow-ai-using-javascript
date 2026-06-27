'use client';
import { useState, useEffect, useRef, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatSection from '../components/ChatSection';
import WelcomeContent from '../components/WelcomeContent';
import InputSection from '../components/InputSection';
import { ChatContext } from './context/Context.js';
import { toast } from 'react-toastify';
import { Generate_Reasponse_API, Get_Chats_API } from '../constants/env';

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const elementsRef = useRef([]);
  const textareaRef = useRef(null);
  const {
    chat,
    setChat,
    isLoggedIn,
    setIsLoggedIn,
    setCanLoadMore,
    isLoadingAns,
    setIsLoadingAns,
    isLoadingChats,
    setIsLoadingChats
  } = useContext(ChatContext);


  const loadChats = async () => {

    if (isLoadingChats) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoadingChats(true);
    try {
      const res = await fetch(Get_Chats_API + `/0`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();
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
        setChat([...optimizedChats]);
        setCanLoadMore(data.canLoadMore);
        setIsLoggedIn(true);
      }

    } catch (err) {
      console.error("Unable to load chats:", err);
    } finally {
      setIsLoadingChats(false);
    }
  }


  useEffect(() => {
    loadChats()
  }, []);


  const getCurrentTime = () => {
    return new Date().toISOString();
  }

  const askQuestion = async () => {

    if (isLoadingAns) return;

    const question = query.trim();
    if (!question) return;

    let answer = "";
    let status = "generating";
    let chatId;
    const newEntry = {
      versions: [{ question, answer, status }],
      curr_version: 0,
      timestamp: getCurrentTime(),
    }

    setQuery("");
    setChat(prev => [...prev, newEntry]);

    // scroll to bottom
    // if (scrollContainerRef.current) {
    //   scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    // }

    setIsLoadingAns(true);


    // ---------Scroll to bottom--------
    setTimeout(() => {
      const elementArray = elementsRef.current;
      if (!elementArray.length) {
        return;
      }
      elementArray[elementArray.length - 1].scrollIntoView({ block: "end", behavior: "smooth" });

    }, 100);

    const token = localStorage.getItem("token");

    const body = {
      question: newEntry.versions[0].question,
      ...(isLoggedIn && { timestamp: newEntry.timestamp })
    };

    try {
      const res = await fetch(Generate_Reasponse_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Could not generate response!!");
      }
      const data = await res.json();
      answer = data.answer || "";
      chatId = data.chatId;

    } catch (error) {
      toast.error("Something went wrong!!");
      console.error(error);

    } finally {
      setIsLoadingAns(false);

      setChat(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0) {
          updated[lastIndex].chatId = chatId;
          updated[lastIndex].versions[0].answer = answer;
          updated[lastIndex].versions[0].status = answer ? "ready" : "error";
        }
        return updated;
      });

    }
  }



  return (
    <>
      <div className='h-screen overflow-hidden bg-[#0a0a0a] flex flex-col'>
        <Navbar openSidebar={() => setShowSidebar(true)} />
        {showSidebar && (<Sidebar
          denySidebar={() => setShowSidebar(false)}
          elementsRef={elementsRef}
        />)
        }
        {!chat.length ?
          <WelcomeContent />
          : <ChatSection
            chat={chat}
            setChat={setChat}
            elementsRef={elementsRef}
          />
        }
        <InputSection
          textareaRef={textareaRef}
          askQuestion={askQuestion}
          query={query}
          setQuery={setQuery}
        />
      </div>
    </>
  )
}