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
    points: null,
    pointsStatus: "loading",
    pointsError: null
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
                ...state,
                profileStatus: "failed",
                profileError: action.error,
            }
        }

        case ("receive-user-points-from-server"): {
            return {
                ...state, 
                points: action.points, 
                pointsStatus: "idle", 
            }
        }

        case ("failure-profile-user-points-from-server"): {
            return {
                ...state,
                pointStatus: "failed",
                pointsError: action.error,
            }
        }
    }
}

const Profile = () => {

    const { userId } = useParams();
    console.log("params", userId)
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
                "userid": `${userId}`,
                // "email": "bessa@gmail.com"
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

        // //if loaded, then fetch user points, ids in headers as string
        // if (state.profileStatus === "idle") {

        //     if (state.profile.points.length > 0) {
        //         console.log("here")
        //         const pointids = state.profile.points.toString();
        //         console.log(pointids, "pointids before fetch")
                
        //         fetch("/points", {
        //         method: "GET", 
        //         headers: {
        //             "Content-Type": "application/json",
        //             "pointids": `${pointids}`
                    
        //         },
        //         })
        //         .then((res) => res.json())
        //         .then((data) => {
        //             console.log("points data", data)
        //             if (data.status === 200) {
        //                 dispatch({
        //                 type: "receive-user-points-from-server",
        //                 points: data.data
        //                 })
        //             }
        //             else (
        //                 dispatch ({
        //                     type: "failure-profile-user-points-from-server",
        //                     error: data.message
        //                 })
        //             )
        //         })
        //         .catch((err) => {
        //             dispatch ({
        //                 type: "failure-profile-user-points-from-server",
        //                 error: err
        //             })
        //         })
        //     }
        //     else {
        //         dispatch ({
        //             type: "receive-user-points-from-server", 
        //             points: []
        //         })
        //     }
        // }
    }, [])

    useEffect(() => {
         //if loaded, then fetch user points, ids in headers as string
         if (state.profileStatus === "idle") {

            if (state.profile.points.length > 0) {
                console.log("here")
                const pointids = state.profile.points.toString();
                console.log(pointids, "pointids before fetch")
                
                fetch("/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "pointids": `${pointids}`
                    
                },
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log("points data", data)
                    if (data.status === 200) {
                        dispatch({
                        type: "receive-user-points-from-server",
                        points: data.data
                        })
                    }
                    else (
                        dispatch ({
                            type: "failure-profile-user-points-from-server",
                            error: data.message
                        })
                    )
                })
                .catch((err) => {
                    dispatch ({
                        type: "failure-profile-user-points-from-server",
                        error: err
                    })
                })
            }
            else {
                dispatch ({
                    type: "receive-user-points-from-server", 
                    points: []
                })
            }
        }
    }, [state.profile])

    let isCurrentUser = false;
    let isFriend = false;

    if (state.profileStatus === "idle" && currentUserStatus === "idle") {
        //determine if the user is the logged in user
        isCurrentUser = (userId === currentUser._id);
    
        //if profile is not a friend of the current user's, display add to my circle button
        isFriend = currentUser.circle.some((friend) => friend === state.profile._id);

    }

    if (state.points) {
        console.log("points", state.points);
    }
    else {
        console.log("nothing in points")
    }
    //sort list of last Posts for the tangents tab before dipslaing
    

    if (currentUserStatus === "loading" || state.profileStatus === "loading" ) {
        console.log("curuserstat", currentUserStatus, "profilestat", state.profileStatus)
        return <PageWrapper>
            <Header></Header>
        </PageWrapper>
    }

//show add friend button
//show gear icon if current user page
    
    return (
        <PageWrapper>
            <Header>{(isCurrentUser) ? "me" : state.profile.name}</Header>
            <ProfileHeader isCurrentUser={(isCurrentUser)} username={state.profile.username} tagline={state.profile.tagline} status={state.profileStatus}/>
            
            {( isFriend || isCurrentUser ) ? (
            <>
            <ProfileTabs tab={tab} setTab={setTab}/>
            {( tab === "tangents") && 
                <TangentPreview />
            }
            
            {( tab === "points" && (state.pointsStatus === "idle") &&
                <>
                    {state.points.map((point) => {
                        console.log(point.type, "pointype");
                        return <PointPreview key={point._id} _id={point._id} coverImgSrc={point.coverImgSrc} title={point.title} 
                        type={point.type} by={point.by} year={point.year} language={point.language} 
                        description={point.description} link={point.link} />
                        })
                    }  
                </>
            )}  
            </> 
            ) : (
                <button>add to circle</button>
            )
        }     
        </PageWrapper>
    )
}

export default Profile;