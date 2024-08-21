import createSocket from "../socket";
import { useState, useEffect } from "react";
import useSpotifyAuthContext from "../hooks/useSpotifyAuthContext";
export const HostPage = () => {
    //const [token, setToken] = useState(Cookies.get("authToken"))
    // const [refreshToken, setRefreshToken] = useState(Cookies.get("refreshToken"));
    const [roomCode, setRoomCode] = useState(null);
    const [players, setPlayers] = useState([]);

    const { isAuthenticated, login} = useSpotifyAuthContext();

    const socket = createSocket();

    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };
    

    const onUserJoin = (user) => {
        console.log(user);
        setPlayers(prevPlayers => [...prevPlayers, user])
    }

    const onUserLeft = (removedPlayer) => {
        console.log(removedPlayer);
        setPlayers(prevPlayers => prevPlayers.filter(player => player.socketId != removedPlayer))
    }
    
    socket.active && console.log('host socket active');
    socket.connected && console.log('host socket connected');
    useEffect(() => {
        const generateRoom = () => {
            const code = generateRoomCode();
            setRoomCode(code);
            socket.emit('create room', code, () => {
                console.log('room created');
            });
            socket.on('user joined', onUserJoin);
            socket.on('user left', onUserLeft);
        }

        if (!isAuthenticated){
            login();
        } else if (!roomCode) {
            generateRoom();
        }
        

        return () => {
            
            socket.off('connect', generateRoom)
            socket.off('user joined', onUserJoin)
            socket.off('user left', onUserLeft)

        };
    }, [socket,roomCode]);



    return (
        <div className="wrapper">
            <div className="container">
                <h1 className="text-3xl mb-4">Room Code:</h1>
                <h1 className="text-8xl my-6">{roomCode}</h1>
                <div className="players">
                    <h1 className="mb-4">Players:</h1>
                    <div className="flex flex-row justify-evenly">
                        {players.map(player => <div className="rounded-full bg-slate-600 text-white text-2xl p-5" key={player.socketId}>{player.name}</div>)}
                    </div>
                </div>
                {players && <input type="button" onClick={handleStartGame}>Start Game</input>}
            </div>
        </div>
    )
}