import { createContext, useState } from "react";

//context to make global variables and functions accessible
export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({children}) => {

    //manage the state of the Add New Tangent Modal
    const [ showNewTangentModal, setShowNewTangentModal ] = useState(false);

    //variable to trigger rerender
    const [ changeCount, setChangeCount ] = useState(0);

    return <GlobalContext.Provider value={{ setShowNewTangentModal, showNewTangentModal, 
                                    changeCount, setChangeCount}}>
        {children}
    </GlobalContext.Provider>
}