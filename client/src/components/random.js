import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import PageWrapper from "./PageWrapper";
import { CurrentUserContext } from "./Profile/CurrentUserContext";
import TangentPreview from "./TangentPreview";

const initialState = {
    tangents: null, 
    tangentsStatus: "loading",
    tangentsError: null,
    points: null,
    pointsStatus: "loading",
    pointsError: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("receive-tangents-data-from-server"): {
            return {
                ...state, 
                tangents: action.tangents, 
                tangentsStatus: "idle", 
            }
        }

        case ("failure-loading-tangents-data-from-server"): {
            return {
                ...state,
                tangentsStatus: "failed",
                tangentsError: action.error,
            }
        }
    
        case ("receive-points-data-from-server"): {
            return {
                ...state, 
                points: action.points, 
                pointsStatus: "idle", 
            }
        }

        case ("no-points-data-to-receive-from-server"): {
            return {
                ...state, 
                pointsStatus: "idle", 
            }
        }

        case ("failure-loading-points-data-from-server"): {
            return {
                ...state,
                pointsStatus: "failed",
                pointsError: action.error,
            }
        }
    }
}
//A list of the current user's Tangents
const MyTangents = () => {

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);

    const [ state, dispatch ] = useReducer(reducer, initialState);

    console.log("current.lastPosts", currentUser.lastPosts);

    //fetch function to get the list 
    const fetchLatestTangentPosts = async () => {
        try {
            const response = await fetch("/tangents/latest-posts", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "tangentids": `${currentUser.tangents}`,
                },
            });

            const data = await response.json();
            if (data.status === 200) {
                console.log(data)
                dispatch({
                type: "receive-tangents-data-from-server",
                tangents: data.data
                })
                return data.data;
            }
            else (
                dispatch ({
                    type: "failure-loading-tangents-data-from-server",
                    error: data.message
                })
            )
            return [];
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-tangents-data-from-server",
                error: err
            })
        }
    }
    
    const fetchPoints = async (postPoints) => {

        try {
            const response = await fetch("/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "pointids": `${postPoints}`,
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                console.log(data)
                dispatch({
                type: "receive-points-data-from-server",
                tangents: data.data
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-points-data-from-server",
                    error: data.message
                })
            )
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-points-data-from-server",
                error: err
            })
        }
    }

    //fetch the latest post for each of the user's tangents
    //then fetch the Points that are referenced in the array of tangents' latests posts just fetched
    useEffect(() => {

        (async () => {
            if (currentUserStatus === "idle") {
                const tangents = await fetchLatestTangentPosts();
                console.log("tangents in async", tangents);

                let pointsReferenced = [];
                tangents.forEach((post) => {
                    if (post.pointId) {
                        pointsReferenced.push(post.pointId);
                    }
                })

                if (pointsReferenced.length > 0) {
                    console.log("fetching points");
                    fetchPoints(pointsReferenced);
                }
                else {
                    dispatch({
                    type: "no-points-data-to-receive-from-server"
                })
                }
                
            }
        })();

    }, [currentUser])


    if (state.tangentsStatus === "loading" || state.pointsStatus === "loading") {
        return <PageWrapper>hello</PageWrapper>
    }

    return (
        <PageWrapper>
            {state.tangents.map((post) => {
                let text = "";
                if (post.pointId) {
                    const point = state.points.find((item) => item._id === post.pointId);
                    text = `POINT: ${point.title} (${point.year}), ${point.by} - ${point.type}`; 
                }
                else {
                    text = post.text;
                }
                return <TangentPreview key={post._id} tangentId={post._id} text={text}
                imgSrc={currentUser.avatar} username={currentUser.username} timestamp={post.timestamp}/>

            })
            }
        </PageWrapper>
    )
}

export default MyTangents;