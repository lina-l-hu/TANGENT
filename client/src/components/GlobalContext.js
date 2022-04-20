import { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({children}) => {

    const [ showNewTangentModal, setShowNewTangentModal ] = useState(false);

    const [ changeCount, setChangeCount ] = useState(0);
    return <GlobalContext.Provider value={{ setShowNewTangentModal, showNewTangentModal, 
                                    changeCount, setChangeCount}}>
        {children}
    </GlobalContext.Provider>
}