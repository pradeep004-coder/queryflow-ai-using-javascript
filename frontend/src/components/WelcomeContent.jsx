import React from 'react'

function WelcomeContent() {
  return (
    <div className='h-[80vh] bg-[#0a0a0a] flex flex-col items-center justify-center'>
      <h1 className="
            text-4xl lg:text-5xl font-bold text-center text-transparent
            bg-clip-text bg-gradient-to-r from-zinc-100 to-blue-400 select-none cursor-pointer"
      >
        Welcome to QueryFlow
      </h1>
      <p className="text-zinc-400 text-lg lg:text-xl select-none">
        Built & Curated by <span className="text-blue-400 font-semibold">Pradeep Prajapati</span>
      </p>
    </div>
  )
}

export default WelcomeContent;