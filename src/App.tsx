import { useEffect, useRef, useState } from 'react';

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId,setroomId]=useState<string>("");
  const wsRef = useRef<WebSocket>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const joinRef= useRef<HTMLInputElement>(null);

  function sendMessages() {
    if(!roomId){
      alert("no rooId can't chat")
    }
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (!inputRef.current || inputRef.current.value.trim() === "") return;

    const message = inputRef.current.value.trim();
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message },
      })
    );

    inputRef.current.value = ""; 
  }
  function joinRoom(){
    const newRoomId=joinRef.current?.value.trim();

    if(newRoomId){
      alert("chatroom joined you can chat now...");
      setMessages([]);
    }
    else{
      alert("Enter roomId to Join chat");
      return;
    }
   
    setroomId(newRoomId);
    

  }

  useEffect(() => {
    if(!roomId){
      return;
    }
     // Close the existing connection if there is one
     if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:8080"); // ✅ Fixed WebSocket URL

   

    ws.onmessage = (event) => {
      setMessages((m) => [...m, event.data]);
    };

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [roomId]);


  return (
    <div className="h-screen bg-black opacity-80 flex flex-col justify-between">
      
    
    <div className='flex justify-end '>  <input ref={joinRef} className='p-2 rounded-sm m-4' type='text' placeholder='Enter Your roomId to Join...'/>
   <div> <button onClick={joinRoom} className='text-black font-semibold bg-green-500 p-3 rounded-md m-4'>Join</button></div>
    </div>
      <div className="h-[85vh]  flex flex-col items-end overflow-y-auto p-2">
        {messages.map((message, index) => (
          <div key={index} className="m-3 mr-8">
            <span className="bg-blue-400 text-black rounded p-2 hover:">{message}</span>
          </div>
        ))}
      </div>
      <div className="w-full bg-white flex p-4">
        <input
          ref={inputRef}
          className="flex-1 p-4 border border-gray-300 rounded"
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessages();
            }
          }}
        />
        <button
          onClick={sendMessages}
           
          className="bg-purple-600 text-white p-4 ml-2 rounded"
        >
          Send
        </button>
        
      </div>
    </div>
  );
}

export default App;
