//Profile page displaying user info

import styled from "styled-components";
import { useState, useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import TangentPreview from "../Tangent/TangentPreview";
import PointPreview from "../PointComponents/PointPreview";
import { CurrentUserContext } from "./CurrentUserContext";
import ToggleInCircleButton from "./ToggleInCircleButton";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    profile: null, 
    profileStatus: "loading",
    profileError: null,
    bookmarkedPoints: null,
    bookmarkedPointsStatus: "loading",
    bookmarkedPointsError: null,
    tangentPoints: null, 
    tangentPointsStatus: "loading", 
    tangentPointsError: null,
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

        case ("receive-bookmarked-points-from-server"): {
            return {
                ...state, 
                bookmarkedPoints: action.points, 
                bookmarkedPointsStatus: "idle", 
            }
        }

        case ("failure-loading-bookmarked-points-from-server"): {
            return {
                ...state,
                bookmarkedPointsStatus: "failed",
                bookmarkedPointsError: action.error,
            }
        }

        case ("receive-tangent-points-from-server"): {
            return {
                ...state, 
                tangentPoints: action.points, 
                tangentPointsStatus: "idle", 
            }
        }

        case ("failure-loading-tangent-points-from-server"): {
            return {
                ...state,
                tangentPointsStatus: "failed",
                tangentPointsError: action.error,
            }
        }

        default : {
            return {
                ...state
            }
        }
    }
}

const Profile = () => {

    const { userId } = useParams();
    const { changeCount } = useContext(GlobalContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);

    const [ tab, setTab ] = useState("tangents");

    //get current user info
    const { state: { currentUserStatus, currentUser} } = useContext(CurrentUserContext);

    //fetch profile function
    const fetchProfile = async () => {
        try {
            const response = await fetch("/users/get-user", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "userid": `${userId}`,
                    // "email": "bessa@gmail.com"
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                dispatch({
                    type: "receive-profile-data-from-server",
                    profile: data.data
                })
                return data.data;
            }
            else (
                dispatch ({
                    type: "failure-loading-profile-data-from-server",
                    error: data.message
                })
            )
            return;
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-profile-data-from-server",
                error: err
            })
        }
    }
    //fetch user's bookmarked points
    const fetchBookmarkedPoints = async () => {
        try {
            const response = await fetch("/users/get-user-points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "_id": `${userId}`
                    
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                dispatch({
                    type: "receive-bookmarked-points-from-server",
                    points: data.data
                })
                return data.data;
            }
            else (
                dispatch ({
                    type: "failure-loading-bookmarked-points-from-server",
                    error: data.message
                })
            )
            return;
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-bookmarked-points-from-server",
                error: err
            })
        }
    }

    //fetch Points from user's latest Tangent posts
    const fetchLatestPostPoints = async (pointids) => {
        try {
            const response = await fetch("/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "pointids": `${pointids}`
                    
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                dispatch({
                    type: "receive-tangent-points-from-server",
                    points: data.data
                })
                return data.data;
            }
            else (
                dispatch ({
                    type: "failure-loading-tangent-points-from-server",
                    error: data.message
                })
            )
            return;
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-tangent-points-from-server",
                error: err
            })
        }
    }

    useEffect(() => {

        (async () => {
           
                const profile = await fetchProfile();

                //create array of Points referenced in the user's last posts
                let pointsReferenced = [];
                
                profile.lastPosts.forEach((post) => {
                    if (post.pointId) {
                        pointsReferenced.push(post.pointId);
                    }
                })

                //get rid of duplicates in both arrays
                const points = [...new Set(pointsReferenced)];
               
                if (points.length > 0) {
                    await fetchLatestPostPoints(points);
                }
                else {
                    dispatch({
                    type: "receive-tangent-points-from-server", 
                    points: []
                })
                }

                fetchBookmarkedPoints();
        })();

    }, [currentUser, changeCount]);

    let isCurrentUser = false;
    let isFriend = false;

    if (state.profileStatus === "idle" && currentUserStatus === "idle") {
        //determine if the user is the logged in user
        isCurrentUser = (userId === currentUser._id);
    
        //if profile is not a friend of the current user's, display add to my circle button
        isFriend = currentUser.circle.some((friend) => friend === state.profile._id);

    }

    // //sort list of last Posts for the tangents tab before dipslaing
    // let sortedLastPosts = state.profile.lastPosts;

    if (currentUserStatus === "loading" || state.profileStatus === "loading" ) {
        return <PageWrapper>
            <LoadingComponent/>
        </PageWrapper>
    }
    
    return (
        <PageWrapper>
            <Body>
            <ProfileHeader isCurrentUser={(isCurrentUser)} username={state.profile.username} tagline={state.profile.tagline} status={state.profileStatus}/>
            
            {( isFriend || isCurrentUser ) ? (
            <>
            <ProfileTabs tab={tab} setTab={setTab}/>
            {( tab === "tangents") && (state.tangentPointsStatus === "idle") &&
                <>
                {state.profile.lastPosts.map((post) => {
                    let text = "";
                    if (Object.keys(post).indexOf("pointId") > -1) {
                        const point = state.tangentPoints.find((item) => item._id === post.pointId);
                        text = `POINT: ${point.title} (${point.year}), ${point.by} - ${point.type}`; 
                    }
                    else {
                        text = post.text;
                    }
                    return <TangentPreview key={post._id} tangentId={post.tangentId} text={text}
                    username={currentUser.username} timestamp={post.timestamp}/>
                })}
                </>
            }
            
            {( tab === "points" && (state.bookmarkedPointsStatus === "idle") &&
                <>
                    {state.bookmarkedPoints.map((point) => {
                        return (
                            // <a href={`/points/${point._id}`}>
                                <PointPreview key={point._id} _id={point._id}  
                                coverImgSrc={point.coverImgSrc} title={point.title} 
                                type={point.type} by={point.by} year={point.year} 
                                description={point.description} link={point.link}
                                userPoints={currentUser.points} />
                            // </a>
                        )
                        })
                    }  
                </>
            )}  
            </> 
            ) : (
                <FriendButtonDiv>
                    <ToggleInCircleButton circle={currentUser.circle} friendId={state.profile._id} format="large"/>
                </FriendButtonDiv>
            )
        }     
        <Spacer></Spacer>
        </Body>
        </PageWrapper>
    )
}

const FriendButtonDiv = styled.div`
    display: flex;
    justify-content: center;
`;

const Body = styled.div`
    overflow: scroll;
`;

const Spacer = styled.div`
    height: 70px;
`;

export default Profile;