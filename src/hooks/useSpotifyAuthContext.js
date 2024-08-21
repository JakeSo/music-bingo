import { useContext } from "react";
import { SpotifyAuthContext } from "../components/SpotifyAuthenticationProvider";

export const useSpotifyAuthContext = () => {
    return useContext(SpotifyAuthContext);
}

export default useSpotifyAuthContext;