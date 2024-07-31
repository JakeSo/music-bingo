import { useNavigate } from "react-router-dom";

export const Home = () => {

    const navigate = useNavigate();
    return(
    <div className="wrapper">
        <div className="container">
            <h3>Welcome to</h3>
            <h1 className="text-9xl">Music Bingo</h1>
            <div className="flex flex-row gap-2">
                <button onClick={() => navigate('host')}>Host</button>
                <button onClick={() => navigate('join')}>Join</button>
            </div>
        </div>
    </div>)
}

export default Home;
