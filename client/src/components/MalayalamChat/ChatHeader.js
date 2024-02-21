import React, { useEffect, useState } from "react";

const ChatHeader = () =>{
    return(
        <div className="flex gap-4 px-4 py-2 items-center bg-gradient-to-r from-green-300 to-blue-300 via-emerald-500  h-[90px] border-collapse  w-full rounded-t-lg ">
            <img className="w-12 h-12 object-cover ring-green-200 ring-opacity-50 ring-4  rounded-full" src="https://i.pinimg.com/564x/73/45/b1/7345b142293c6695e32ccc7535aa5805.jpg"/>
            <h1 className="font-bold text-xl ml-1 ">Mellissa</h1>
        </div>
    )
}

export default ChatHeader;