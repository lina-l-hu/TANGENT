import styled from "styled-components";
import { useEffect, useReducer } from "react";
import { NavLink, useParams } from "react-router-dom";
import PageWrapper from "../PageWrapper";
import Textbox from "./Textbox";
import Message from "./Message";
import Header from "../Header";
import PointPreview from "../PointPreview";

const initialState = {
    tangentStatus: "loading", 
    tangent: null,
    usersStatus: "loading", 
    users: null, 
    pointsStatus: "loading", 
    points: null, 
    error: null, 
}

const reducer = (state, action) => {
    switch (action.type) {

        case ("receive-tangent-data-from-server"): {
            return {
                ...state, 
                tangent: action.tangent, 
                tangentStatus: "idle", 
            }
        }

        case ("failure-loading-tangent-data-from-server"): {
            return {
                ...state,  
                tangentStatus: "failed",
                error: action.error,
            }
        }

        case ("receive-users-data-from-server"): {
            return {
                ...state, 
                users: action.users, 
                usersStatus: "idle", 
            }
        }

        case ("failure-loading-users-data-from-server"): {
            return {
                ...state,  
                usersStatus: "failed",
                error: action.error,
            }
        }

        case ("receive-points-data-from-server"): {
            return {
                ...state, 
                points: action.points, 
                pointsStatus: "idle", 
            }
        }

        case ("failure-loading-points-data-from-server"): {
            return {
                ...state,  
                pointsStatus: "failed",
                error: action.error,
            }
        }
    }
}

//Each Tangent component is a chat thread
const Tangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);

    const [ state, dispatch ] = useReducer(reducer, initialState);

    useEffect(() => {
        fetch(`/tangents/${tangentId}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",        
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("tangent", data)
            if (data.status === 200) {
                dispatch({
                    type: "receive-tangent-data-from-server",
                    tangent: data.data
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-tangent-data-from-server",
                    error: data.message
                })
            )
        })
        .catch((err) => {
            dispatch ({
                type: "failure-loading-tangent-data-from-server",
                error: err
            })
        })
    }, []);

    //have to fetch all the users in the chat so we have their profile picture and name
    //to display -- change handler to allow multiple fetch
    useEffect(() => {
        if (state.tangentStatus === "idle") {

        }
    })

    //have to fetch all the Points in the Tangent too
    useEffect(() => {
        if (state.tangentStatus === "idle") {
            
            fetch(`/tangent/points`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json", 
                    "_id": `${tangentId}`       
                },
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("tangent", data)
                if (data.status === 200) {
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
    }, [state.tangent])

    if (state.tangentStatus === "loading") {
        return <PageWrapper>
            <Header>tangent</Header>
        </PageWrapper>
    }

    return (
        <PageWrapper>
            <Header>{state.tangent.tangentName}</Header>
            <AllPointsLink to={`/${tangentId}/points`}>all Points mentioned</AllPointsLink>
            <Messages>
                {state.tangent.map((post) => {
                    if (post.text) {
                        <Message key={post._id} text={post.text} username avatar 
                        timestamp={post.timestamp}/>
                    }
                    else {
                        //find point in the points array and display
                        <PointPreview />

                    }
                })}
            </Messages>
            <Textbox />
        </PageWrapper>
    )
}

const AllPointsLink = styled(NavLink)`
    margin: 0 auto;
    margin-top: 15px;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--color-main);
    border-radius: 20px;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export default Tangent;