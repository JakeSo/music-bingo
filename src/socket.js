import { io } from "socket.io-client";

const createSocket = () =>{
    return io('http://localhost:8888', {
        autoConnect: false
    });
}

export default createSocket;