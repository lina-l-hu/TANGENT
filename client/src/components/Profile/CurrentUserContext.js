import { createContext, useEffect, useReducer, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GlobalContext } from "../GlobalContext";
import usePersistedState from "../../usePersistedState.hook";

export const CurrentUserContext = createContext(null);

const initialState = {
    // authProfile: null,
    currentUser: null, 
    currentUserStatus: "loading",
    currentUserError: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        // case ("logged-in"): {
        //     return {
        //         ...state, 
        //         authProfile: action.profile,
        //     }
        // }

        case ("receive-profile-data-from-server"): {
            return {
                ...state, 
                currentUser: action.profile, 
                currentUserStatus: "idle", 
            }
        }

        case ("failure-loading-profile-data-from-server"): {
            return {
                ...state, 
                currentUserStatus: "failed",
                currentUserError: action.error,
            }
        }
    }
}

export const CurrentUserProvider = ({children}) => {

    // const { user, isLoading } = useAuth0();
    // console.log("logged in user", user)
    
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { changeCount, setChangeCount } = useContext(GlobalContext);
    const [ token, setToken] = usePersistedState(null, "userToken");
    const [ signedInEmail, setSignedInEmail ] = useState(null);
    const [ signedInUID, setSignedInUID ] = usePersistedState("", "signed-in-user");
    const [ loadedCircle, setLoadedCircle ] = useState([]);
    const [ loadedBookmarks, setLoadedBookmarks ] = useState([]);

    useEffect(() => {
        
        if (token) {

            console.log("signed in emial", signedInEmail);

            fetch("/users/get-user", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "email": `${signedInEmail}`,
                    "userid": `${signedInUID}`
                   
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("profile of current user", data)
                if (data.status === 200) {
                    setSignedInUID(data.data._id);
                    dispatch({
                    type: "receive-profile-data-from-server",
                    profile: data.data
                    })

                    setLoadedBookmarks(data.data.points);
                    setLoadedCircle(data.data.circle);
                }
                else (
                    dispatch ({
                        type: "failure-loading-profile-data-from-server",
                        error: data.message
                    })
                )
            })
            .catch((err) => {
                dispatch ({
                    type: "failure-loading-profile-data-from-server",
                    error: err
                })
            })
        }
    }, [token, changeCount])
        

    //store userId in session storage with persisted state hook! 


    return <CurrentUserContext.Provider value={{state, token, signedInEmail, signedInUID,  
                                                loadedBookmarks, loadedCircle,
                                                actions: { setToken, setSignedInEmail, setSignedInUID, 
                                                setLoadedBookmarks, setLoadedCircle }}}>
        {children}
        </CurrentUserContext.Provider>
}