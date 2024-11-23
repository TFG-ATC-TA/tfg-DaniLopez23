
import { useContext } from "react";

import { SocketContext } from "@/WebSockets/SocketProvider";



export const useSocket = () => useContext(SocketContext);