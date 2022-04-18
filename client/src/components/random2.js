import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import { CurrentUserContext } from "./Profile/CurrentUserContext";
import TangentPreview from "./TangentPreview";

const initialState = {
    points: null,
    pointsStatus: "loading",
    pointsError: null,
}

const reducer = (state, action) => {
    switch (action.type) {
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
                points: [], 
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

    useEffect(() => {

        if (currentUserStatus === "idle") {

        let pointsReferenced = [];
   
        currentUser.lastPosts.forEach((post) => {
            if (post.pointId) {
                pointsReferenced.push(post.pointId);
            }
        })

        if (pointsReferenced.length === 0) {
            dispatch({
                type: "no-points-data-to-receive-from-server"
            })
        }
        else {
            fetch("/points", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "pointids": `${pointsReferenced}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                console.log(data)
                dispatch({
                type: "receive-points-data-from-server",
                points: data.data
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-points-data-from-server",
                    error: data.message
                })
            )
        })
        .catch((err) => {
            dispatch ({
                type: "failure-loading-points-data-from-server",
                error: err
            })
        })
        }

        
    }
    }, [currentUser]) //currentUser?? 

    //then fetch the Points that are referenced in the array of tangents' latests posts just fetched


    if (currentUserStatus === "loading" || state.pointsStatus === "loading") {
        return <PageWrapper>hello</PageWrapper>
    }

    return (
        <PageWrapper>
            {currentUser.lastPosts.map((post) => {
                let text = "";
                if (Object.keys(post).indexOf("pointId") > -1) {
                    const point = state.points.find((item) => item._id === post.pointId);
                    text = `POINT: ${point.title} (${point.year}), ${point.by} - ${point.type}`; 
                }
                else {
                    text = post.text;
                }
                return (
                    <NavLink to={`/tangents/${post.tangentId}`}>
                        <TangentPreview key={post._id} tangentId={post._id} text={text}
                        imgSrc={currentUser.avatar} username={currentUser.username} timestamp={post.timestamp}/>
                    </NavLink>
                )
            })
            }
        </PageWrapper>
    )
}

export default MyTangents;