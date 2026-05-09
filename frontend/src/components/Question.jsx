import { useContext, useState } from "react";
import { FaCheck, FaRegEdit } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { toast } from "react-toastify";
import { ChatContext } from "../app/context/Context";

function Question({ question, timestamp, index, active_version, onVersionChange }) {
  const [isCopied, setIsCopied] = useState(false);
  const { chat, setChat, isLoggedIn } = useContext(ChatContext);
  const total_versions = chat[index].versions.length;

  const handleCopy = async () => {
    try {
      if (isCopied) return;
      await navigator.clipboard.writeText(question);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {
      toast.error("failed to copy.");
    }
  }

  const handleEdit = () => {
    if (!isLoggedIn) {
      toast.warn("Please login to continue");
      return;
    }
    setChat(prev =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const versions = item.versions.map((v, vi) =>
          vi === item.curr_version
            ? { ...v, status: "editing" }
            : v
        );

        return { ...item, versions };
      })
    );
  }

  return (
    <>
      <p className="text-right text-xs my-1">({index + 1}/{chat.length})</p>
      <div className="max-w-[75%] w-fit ml-auto bg-zinc-800 p-3 rounded-2xl rounded-tr-none whitespace-normal">
        <pre className="text-zinc-200 text-sm whitespace-normal">{question}</pre>
        <div className="text-xs text-gray-400 text-right mt-1 select-none">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </div>

      <div className="ml-auto my-2 mr-2 w-fit flex gap-4 text-sm">
        <button onClick={handleCopy} className="cursor-pointer">
          {isCopied ?
            <FaCheck size={12}/>
            : <MdOutlineContentCopy size={12}/>}
        </button>
        <button className="cursor-pointer" onClick={handleEdit}>
          <FaRegEdit size={12}/>
        </button>
        {chat[index].versions.length > 1 && <div className="text-xs flex gap-1">
          <button className=" cursor-pointer" onClick={() => onVersionChange(false, index)}>
            &lt;
          </button>
          <span className="">{active_version}/{total_versions}</span>
          <button className=" cursor-pointer" onClick={() => onVersionChange(true, index)}>
            &gt;
          </button>
        </div>}
      </div>
    </>
  )
}

export default Question;