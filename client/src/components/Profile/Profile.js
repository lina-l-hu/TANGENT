import styled from "styled-components";
import { useState, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../PageWrapper";
import Header from "../Header";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import TangentPreview from "../TangentPreview";
import PointPreview from "../PointPreview";
import { CurrentUserContext } from "./CurrentUserContext";

const initialState = {
    profile: null, 
    profileStatus: "loading",
    profileError: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("receive-profile-data-from-server"): {
            return {
                ...state, 
                profile: action.profile, 
                profileStatus: "idle", 
            }
        }

        case ("failure-loading-profile-data-from-server"): {
            return {
                ...initialState, 
                profileStatus: "failed",
                profileError: action.error,
            }
        }
    }
}

const Profile = () => {

    const userId = useParams();
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const [ tab, setTab ] = useState("tangents");

    //get current user info
    const { state: { currentUserStatus, currentUser} } = useContext(CurrentUserContext);

    //load profile into state
    //change hardcode
    useEffect(() => {
        fetch("/users/get-user", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                // "email": `${user._id}`
                "email": "bessa@gmail.com"
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("profile data", data)
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

        //if loaded, then fetch user tangents for preview
    }, [])

    let isCurrentUser = false;
    let isFriend = false;

    if (state.profileStatus === "idle" && currentUserStatus === "idle") {
        //determine if the user is the logged in user
        isCurrentUser = (userId === currentUser._id);
    
        //if profile is not a friend of the current user's, display add to my circle button
        isFriend = currentUser.circle.some((friend) => friend === state.profile._id);

    }

    //sort list of last Posts for the tangents tab before dipslaing

    if (currentUserStatus === "loading" || state.profileStatus === "loading") {
        return <PageWrapper>
            <Header></Header>
        </PageWrapper>
    }


    
    return (
        <PageWrapper>
            <Header>{(isCurrentUser) ? "me" : state.profile.name}</Header>
            <ProfileHeader tagline={state.profile.tagline}/>
           
            {(isFriend) ? ( 
                <>
                <ProfileTabs tab={tab} setTab={setTab}/>
                {( tab === "tangents") ? (
                    <TangentPreview />
                    ) : (
                    <PointPreview />
                )}
                </>
            ) : (
                <button>add to circle</button>
            )}
            
            
        </PageWrapper>
    )
}

export default Profile;