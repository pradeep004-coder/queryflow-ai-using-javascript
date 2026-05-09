import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import ConfirmLogout from "./ConfirmLogout";
import { ChatContext } from "../app/context/Context";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";

function Sidebar({ denySidebar, elementsRef }) {

  const [isOpening, setIsOpening] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { chat, setChat, isLoggedIn, setIsLoggedIn, canLoadMore, setCanLoadMore, isLoadingChats, setIsLoadingChats, } = useContext(ChatContext);
  const router = useRouter();

  useEffect(() => {
    setIsOpening(true);
  }, [])

  const handleCloseSidebar = () => {
    setIsOpening(false);
    setTimeout(() => {
      denySidebar();
    }, 100);
  }

  const handleLoadMore = async () => {

    if (!isLoggedIn && !canLoadMore && isLoadingChats) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoadingChats(false);
      return;
    };

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
        console.log("Coudn't load: 401");
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        toast.warn("Please login to continue");
        return;
      }

      const data = await response.json();

      if (Array.isArray(data.chats)) {
        const optimizedChats = data.chats.map((item) => {
          const versions = item.versions.map((v) => ({ ...v, status: "ready" }))
          return {
            chatId: item.chatId,
            versions,
            curr_version: versions.length-1,
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

  const handleLoggout = () => {
    setShowConfirm(true)
  }

  return (
    <div
      className="bg-black/50 z-20 h-full w-full fixed left-0 top-0 "
      onClick={handleCloseSidebar}
    >
      <div className={`bg-zinc-800 opacity-100 h-full p-3
                        w-[80%] lg:w-[30%] 
                        shadow-lg
                        flex flex-col
                        transition-all ease-in-out duration-300 transform ${isOpening ? 'translate-x-0' : '-translate-x-full'}
                        z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-end'>
          <button
            type='button'
            className='text-zinc-300 hover:text-white text-lg font-bold select-none'
            onClick={handleCloseSidebar}
          >✕</button>
        </div>

        <div className='border-b border-white text-center select-none cursor-pointer'>Recent</div>

        <div className="flex-grow overflow-y-auto scrollbar py-2">
          {[...chat].reverse().map((item, index) => (
            <div
              key={index}
              className={
                `flex-shrink-0
                  w-full
                  px-1
                  hover:bg-zinc-700
                  text-sm
                  select-none cursor-pointer
                  truncate
                  overflow-x-hidden text-ellipsis whitespace-nowrap
                  transition-all duration-300 
                  ${item.versions[item.curr_version].status === "generating" ? 'fade-animation' : null}
                  ${item.versions[item.curr_version].status === "error" ? 'text-red-300' : null}`
              }
              onClick={
                () => {
                  elementsRef.current[chat.length - index - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }
            >
              {/* {item.versions[item.curr_verion].question || "question"} */}
              {item.versions[item.curr_version].question}
            </div>
          ))}
          {isLoggedIn && canLoadMore && chat.length &&
            <div className="flex justify-center">
              <button
                className="bg-zinc-900 text-xs rounded-lg shadow-lg px-2 py-1"
                onClick={handleLoadMore}
              >
                {isLoadingChats ? <ClipLoader
                  color="grey"
                  loading={isLoadingChats}
                  size={12}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
                  : "Load More"}
              </button>
            </div>}
        </div>
        <div className="mt-auto pt-2">
          {isLoggedIn ?
            <button type="button" onClick={handleLoggout} className="text-sm bg-red-600 text-xs hover:bg-red-500 mx-auto flex gap-3 w-fit px-2 py-1 rounded-md transition-colors duration-200">
              <span>Logout</span>
              <FiLogOut size={16} />
            </button>
            : <button type="button" onClick={() => router.push("/login")} className="self-end bg-zinc-700 hover:bg-zinc-600 text-xs mt-auto mx-auto flex gap-2 w-fit px-2 py-1 rounded-md transition-colors duration-200">
              <span>Login</span>
              <FiLogIn size={16} />
            </button>}
        </div>
      </div>
      {showConfirm && <ConfirmLogout setShow={setShowConfirm} handleCloseSidebar={handleCloseSidebar} />}
    </div>
  )
}

export default Sidebar;