
export default function DateBadge({visibleDate, isDateVisible}) {

    return (
        <div className={`fixed left-0 w-[100vw] ${isDateVisible? "top-10 opacity-100" : "-top-2 opacity-0"} flex justify-center transition-all duration-300 ease-in-out`}>
            <div className="py-1 px-2 text-xs bg-zinc-700 rounded-xl -translate-x-[5px]">
                {visibleDate}
            </div>
        </div>
    )
}
