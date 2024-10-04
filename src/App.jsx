import { useState } from 'react'
import './App.css'
import socket from './socket'

function App() {

  useEffect(() => {
    const onConnect = () => {
      console.log("Connected to server");
    };

    const onDisconnect = () => {
      console.log("Disconnected from server");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <div>
       
      </div>
    </>
  )
}

export default App
