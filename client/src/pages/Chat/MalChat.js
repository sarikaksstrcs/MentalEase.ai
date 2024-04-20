import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ChatHeader from "../../components/MalayalamChat/ChatHeader";
import { MicIcon,SendIcon} from "../../components/Icons/Icons";


const MalChat = () => {
    const [responseText, setResponseText] = useState('');
    const [englishText, setEnglishText] = useState('')
    const [isFetching, setIsFetching] = useState(false)

    const [malInput,setMalInput] = useState('');
    const [gptResponse, setGptResponse] = useState(null)
    const name = JSON.parse(localStorage.getItem("data")).name;


    // Common code to fetch (instead of using axios)
    const fetchData = (url, options) => {
        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            });
    };

    // text handling
    const handleSend = async() =>{
        console.log("send Clicked")
        setResponseText(malInput)
        console.log(malInput)
        setMalInput("")
        fetchData('http://127.0.0.1:8000/maltextResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: malInput
            })
        })
        .then(gptout => {
            // const { gptresponse } = data;
            console.log(gptout)
            setGptResponse(gptout.gptresponse);
            return fetchData('http://127.0.0.1:8000/engtexttomalaudio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ malayalam_text: gptout.gptresponse })
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    }
    
    //Audio handling
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
            <Navbar className/>
            <div className="w-3/4 px-36 py-5 overflow-hidden  bg-gradient-to-br from-green-400 to-green-200">
                <div className="flex w-full pt-5 ">
                    <div className="bg-sky-100 w-full h-[480px] p-0 items-center content-center shadow-lg bg-opacity-70 rounded-md rounded-b-lg     ">
                        <ChatHeader />
                        <div className="h-2/3 flex flex-col gap-4 my-1 mx-1 overflow-y-scroll static ">
                            {(responseText && <div className="flex justify-end">
                            <div className="bg-white mt-2 mr-1 rounded-md rounded-tr-none p-4 ml-20 shadow-xl font-serif ">
                            
                                <span className="font-bold text-black mr-2">{name} :</span>
                                <span className="text-gray-600">{responseText}</span>

                            </div>
                            </div>)}

                        {gptResponse&&(<div className="flex">
                            <div className="bg-white rounded-md rounded-tl-none p-4 mr-20 shadow-xl">
                            <b>Mellisa :  </b>
                            {gptResponse}

                            </div>
                            </div>)}
                        </div>
                            
                        <div className="flex content-end row-start-3 my-1 px-0 h-10  bg-white m-5">
                            <input className="w-full mx-1 font-sans"
                                placeholder="Enter Text in Malayalam"
                                value={malInput}
                                onChange={(e) => setMalInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSend();
                                    }
                                }} />
                            <div className={`cursor-pointer bg-sky-200 shadow-xl w-14 flex justify-center items-center hover:bg-sky-300`}
                                onClick={handleSend}>
                                <SendIcon />
                            </div>
                        </div>                        
                    </div>
                                    
                </div>

                <div className="flex w-full justify-center mt-2">
                <div className={`cursor-pointer bg-rose-600 rounded-full w-14  h-14 flex justify-center items-center shadow-2xl ${isFetching ? 'animate-ping 3s scale-50' : ''} hover:scale-110 duration-300 `}  onClick={handleClick}>
                        <MicIcon />
                 </div>
                </div>
            </div>
            
        </div>
    )
}

export default MalChat;