import { createContext, useState } from "react";

export const CurrentTangentContext = createContext(null);

export const CurrentTangentProvider = ({children}) => {
    const [ displaySuggestionsDropup, setDisplaySuggestionsDropup] = useState(false);
    
    //fetch all users in conversation, store in state to render name and avatars

    return <CurrentTangentContext.Provider value={{ displaySuggestionsDropup, setDisplaySuggestionsDropup }}>
        {children}
    </CurrentTangentContext.Provider>
}