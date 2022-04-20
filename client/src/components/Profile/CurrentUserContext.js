import { createContext, useEffect, useReducer, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { GlobalContext } from "../GlobalContext";

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
    useEffect(() => {
        // if (!isLoading) {

        //     dispatch({ 
        //         type: "logged-in",
        //         profile: user,
        //     })

            fetch("/users/get-user", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "email": `lina.l.hu@gmail.com`
                   
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("profile of current user", data)
                if (data.status === 200) {
                    dispatch({
                    type: "receive-profile-data-from-server",
                    profile: data.data
                    })
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
        // }
    }, [changeCount])
        

    //store userId in session storage with persisted state hook! 


    return <CurrentUserContext.Provider value={{state}}>
        {children}
        </CurrentUserContext.Provider>
}