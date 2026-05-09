import { useContext } from "react";
import { ChatContext } from "../app/context/Context.js";
import { ClipLoader } from "react-spinners";
import { MdSend } from "react-icons/md";

function InputSection({ askQuestion, textareaRef, query, setQuery }) {
    const { isLoadingAns } = useContext(ChatContext);

    const handleInput = (e) => {
        const el = e.target;

        setQuery(el.value);

        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault(); // prevent newline
            if (query.trim()) {
                askQuestion();
            }
        }
    };

    return (
        <div className='fixed bottom-10 w-full bg-black/0 flex justify-center'>
            <form className="
                w-[90%] lg:w-[70%]
                bg-zinc-900
                p-2
                text-white
                border border-zinc-700
                rounded-4xl
                flex"
                onSubmit={(e) => {
                    if (!query.trim()) return;
                    e.preventDefault()
                    askQuestion()
                }}
            >
                <textarea
                    ref={textareaRef}
                    value={query}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className={
                        `w-full max-h-[8rem] 
                    resize-none 
                    my-1 mx-2
                    outline-none 
                    bg-transparent
                    overflow-y-auto 
                    scroll-invisible
                    text-sm`
                    }
                    placeholder="Ask me anything..."
                ></textarea>
                {query.length > 0 && !isLoadingAns &&
                    <button
                        type='submit'
                        className='mb-[2px] mt-auto select-none'
                    >
                        <MdSend size={24} className="text-zinc-300" />
                    </button>
                }
                {isLoadingAns &&
                    <button
                        type='submit'
                        className='mt-1 select-none'
                    >
                        <ClipLoader
                            color="gray"
                            loading={isLoadingAns}
                            size={24}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </button>
                }
            </form>
        </div>
    )
}

export default InputSection;