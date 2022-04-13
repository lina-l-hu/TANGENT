import { createContext } from "react";

export const CurrentUserContext = createContext(null);

export const CurrentUserProvider = ({children}) => {
    //fetch current user info, dependency array?? 
}