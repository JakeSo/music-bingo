import { useState } from "react"
import createSocket from "../socket";
export const JoinPage = () => {

    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    
    const socket = createSocket();

    window.onbeforeunload = () => {
        
        socket.emit('leaving room');
    }

    const joinRoom = () => {
        if (roomCode && name) {

            socket.connect();
            console.log('joining room ' + roomCode);
            socket.emit('join room', roomCode, name, (isRoom) => {
                if (!isRoom) {
                    setError('Invalid room');
                    socket.disconnect();
                } 
            });
        } else if (roomCode) {
            setError('Please enter a name');
        } else {
            setError('Please enter a valid room code')
        }


    }

    return (
        <>
            <p className="text-red-600">{error}</p>
            <div className="flex flex-col gap-3">
                <input type="text" className="rounde" placeholder="Room Code" maxLength={6} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} value={roomCode} ></input>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} value={name}></input>
                <button type="button" onClick={joinRoom} >Join Room</button>
            </div>
        </>
    )
}