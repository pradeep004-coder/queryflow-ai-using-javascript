import { useContext } from "react";
import { ChatContext } from "../app/context/Context.js";
import { useRouter } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";

export default function Navbar({ openSidebar }) {
  const { isLoggedIn } = useContext(ChatContext);
  const router = useRouter();

  return (
    <nav className="grid grid-cols-3 bg-zinc-900 px-2 py-1 shadow-m z-20">

      {/* LEFT: Sidebar Toggle */}
      <button
        type="button"
        aria-label="Open sidebar"
        className="justify-self-start py-1 px-2 hover:bg-zinc-800 rounded-md cursor-pointer transition duration-200 ease-in-out"
        onClick={(e) => {
          e.stopPropagation();
          openSidebar();
        }}
      >
        <RxHamburgerMenu />
      </button>

      {/* CENTER: Logo */}
      <h2
        onClick={() => router.push("/")}
        className=" font-semibold justify-self-center flex-grow select-none hover:text-white transition"
      >
        QueryFlow
      </h2>

      {/* RIGHT: Auth Actions */}
      <div className="justify-self-end">
        {!isLoggedIn && (
          <button
            type="button"
            className="border border-zinc-400 rounded-xl px-1 text-sm cursor-pointer hover:bg-zinc-800 transition duration-200 ease-in-out"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        )}
      </div>

    </nav>
  );
}