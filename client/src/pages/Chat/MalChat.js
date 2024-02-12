import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ChatHeader from "../../components/MalayalamChat/ChatHeader";

const MalChat = () => {
    const [responseText, setResponseText] = useState('');
    const [englishText, setEnglishText] = useState('')
    const [isFetching, setIsFetching] = useState(false)

    const [gptResponse, setGptResponse] = useState('')
    const name = JSON.parse(localStorage.getItem("data")).name;

    const audioRec = () =>{
        
    }
    const fetchData = (url, options) => {
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };
    
    const handleClick = () => {
        console.log("Clicked");
        setTimeout(() => {
            setIsFetching(true);
        }, 2000);
        console.log("fetch req send");
    
        fetchData('http://127.0.0.1:8000/malaudiotoengtext', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(malToEngData => {
            console.log(malToEngData);
            setResponseText(malToEngData.malayalam_text);
            setEnglishText(malToEngData.english_text);
            setIsFetching(false);
    
            return fetchData('http://127.0.0.1:8000/gptinterface', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: malToEngData.english_text })
            });
        })
        .then(gptData => {
            console.log(gptData);
            setGptResponse(gptData.gptresponse);
    
            return fetchData('http://127.0.0.1:8000/engtexttomalaudio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ malayalam_text: gptData.gptresponse })
            });
        })
        .then(audioData => {
            console.log(audioData);
            // Handle the response data as needed
        })
        .catch(error => {
            console.error('Error:', error);
            setEnglishText("");
        })
        .finally(() => {
            setIsFetching(false);
        });
    };
    

    return(
        <div className="flex h-screen w-screen">
            <Navbar className="w-80"/>
            <div className="w-full px-36 py-5 overflow-hidden">
                <div className="flex w-full pt-5 ">
                    <div className="bg-green-100 w-full h-[480px] p-0 items-center content-center shadow-lg bg-opacity-70 rounded-md rounded-b-lg     ">
                        <ChatHeader />
                        <div className="h-2/3 flex flex-col gap-4 my-1 mx-1 overflow-y-scroll static ">
                        <div className="pb-0 my-2 ">
                            <b>{name} :  </b>
                            {responseText}
                        </div>
                        <div className="row-start-2 my-2">
                            <b>Mellisa  : </b>
                            {gptResponse}
                        </div>
                        </div>
                            
                            <div className= "flex content-end row-start-3 my-1 px-0 h-10  bg-white m-5  " >
                                <input className="w-full mx-1 font-sans" placeholder="Enter Text in Malayalam"/>
                                <div className={`bg-green-200 shadow-xl w-14 flex justify-center items-center hover:bg-green-300`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:scale-125  duration-300">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                </div>                                
                            </div>                            
                    </div>
                                    
                </div>

                <div className="flex w-full justify-center mt-2">
                <div className={`bg-red-400 rounded-full w-14  h-14 flex justify-center items-center shadow-2xl ${isFetching ? 'animate-ping-slow' : ''} hover:scale-110 duration-300 `}  onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6  hover:text-green-800">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                        </svg>
                 </div>
                </div>
            </div>
            
        </div>
    )
}

export default MalChat;