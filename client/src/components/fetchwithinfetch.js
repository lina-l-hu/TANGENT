import styled from "styled-components";
import { useReducer, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "./TangentPreview";
import Header from "./Header";

const initialState = {
    point: null,
    pointStatus: "loading",
    tangents: null, 
    tangentsStatus: "loading", 
    error: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("receive-point-from-server"): {
            return {
                ...state, 
                point: action.point, 
                pointStatus: "idle", 
            }
        }

        case ("failure-loading-point-from-server"): {
            return {
                ...state,
                pointStatus: "failed",
                error: action.error,
            }
        }

        case ("receive-tangents-from-server"): {
            return {
                ...state, 
                tangents: action.tangents, 
                tangentsStatus: "idle", 
            }
        }

        case ("failure-loading-tangents-from-server"): {
            return {
                ...state,
                tangentsStatus: "failed",
                error: action.error,
            }
        }

        case ("failure-loading-from-server"): {
            return {
                ...state,
                tangentsStatus: "failed",
                pointStatus: "failed",
                error: action.error,
            }
        }
    }
}

const PointDetails = () => {

    const { pointId } = useParams();
    console.log("pointid", pointId)

    const [ state, dispatch ] = useReducer(reducer, initialState);
    //fetch point
    //fetch tangents that mention point

    useEffect(() => {

        fetch("/points", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "pointids": `${pointId}`
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("point", data)
            if (data.status === 200) {
                dispatch({
                    type: "receive-point-from-server",
                    point: data.data[0]
                })

                const tangentIds = data.data[0].mentionedIn;
                
                //fetch tangents that mention this point
                return fetch("/tangents/latest-posts", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                        "tangentids": `${tangentIds}`
                    },
                })
                .then((res) => res.json())
                .then((data) => {
                    console.log("tangents", data)
                    if (data.status === 200) {
                        dispatch({
                            type: "receive-tangents-from-server",
                            tangents: data.data
                        })
                    }
                    else (
                        dispatch ({
                            type: "failure-loading-tangents-from-server",
                            error: data.message
                        })
                    )
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-point-from-server",
                    error: data.message
                })
            )
        })
        .catch((err) => {
            dispatch ({
                type: "failure-loading-from-server",
                error: err
            })
        })
    }, [])

    if (state.pointStatus === "loading" && state.tangentsStatus === "loading") {
        return (
            <PageWrapper>
                <Header>point</Header>
            </PageWrapper>
        )
    }
    return (
        <PageWrapper>
            <Header>{state.point.title}</Header>
            <PointPreview _id={state.point._id} coverImgSrc={state.point.coverImgSrc} title={state.point.title} type={state.point.type} 
                    by={state.point.by} year={state.point.year} description={state.point.description} link={state.point.link} format="full"/>
            <MentionedDiv>mentioned in these Tangents</MentionedDiv>
            {state.tangents.map((post) => {
                <NavLink to={`/tangents/${post.tangentId}`} key={post._id}>
                    <h4>{post.tangentName}</h4>
                    <TangentPreview tangentId={post.tangentId} text={text}
                    imgSrc={user.avatar} username={user.username} timestamp={post.timestamp}/>
                </NavLink>
            })}
            <TangentPreview />
        </PageWrapper>
    )
}

const MentionedDiv = styled.h4`
    margin: 10px auto;
    font-style: italic;
`;

export default PointDetails;