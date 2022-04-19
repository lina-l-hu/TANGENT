import styled from "styled-components";
import { useReducer, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "./TangentPreview";
import Header from "./Header";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

const initialState = {
    point: null,
    pointStatus: "loading",
    pointError: null,
    tangents: null, 
    tangentsStatus: "loading", 
    tangentsError: null,
    users: null, 
    usersStatus: "loading", 
    usersError: null,
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
                pointError: action.error,
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
                tangentError: action.error,
            }
        }

        case ("no-tangents-data-to-receive-from-server"): {
            return {
                ...state, 
                tangents: [],
                tangentsStatus: "idle", 
            }
        }

        case ("receive-users-data-from-server"): {
            return {
                ...state, 
                users: action.users, 
                usersStatus: "idle", 
            }
        }

        case ("no-users-data-to-receive-from-server"): {
            return {
                ...state, 
                users: [],
                usersStatus: "idle", 
            }
        }

        case ("failure-loading-users-data-from-server"): {
            return {
                ...state,
                usersStatus: "failed",
                usersError: action.error,
            }
        }
    }
}

const PointDetails = () => {

    const { pointId } = useParams();
    console.log("pointid", pointId);

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);

    const [ state, dispatch ] = useReducer(reducer, initialState);
    // console.log("statuses", state.pointStatus, state.tangentsStatus, state.usersStatus);

    //fetch function to get point
    const fetchPoint = async () => {

        if (!pointId || pointId === undefined) {
            return;
        }

        console.log("fetching point")
        try {
            const response = await fetch("/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "pointids": `${pointId}`
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                console.log(data)
                dispatch({
                    type: "receive-point-from-server",
                    point: data.data[0]
                })
                return data.data[0];
            }
            else (
                dispatch ({
                    type: "failure-loading-point-from-server",
                    error: data.message
                })
            )
            return [];
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-point-from-server",
                error: err
            })
        }
    }

    //fetch the latest post for each Tangent that mentions the Point
    const fetchLatestTangentPosts = async (tangentIds) => {
        try {
            const response = await fetch("/tangents/latest-posts", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "tangentids": `${tangentIds}`,
                },
            });

            const data = await response.json();
            if (data.status === 200) {
                console.log("tangents fetch", data)
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

    //fetch users to get their avatar and username info
    const fetchUsers = async (userIdArray) => {
        try {
            const response = await fetch("/users/get-users", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "userids": `${userIdArray}`,
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                console.log(data)
                dispatch({
                    type: "receive-users-data-from-server",
                    users: data.data
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-users-data-from-server",
                    error: data.message
                })
            )
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-users-data-from-server",
                error: err
            })
        }
    }
    
    
    useEffect(() => {
        console.log("hullo");
        (async () => {
            
            const point = await fetchPoint();
            console.log("point", point);

            if (point.mentionedIn.length === 0) {
                dispatch({
                    type: "no-tangents-data-to-receive-from-server"
                })
                dispatch({
                    type: "no-users-data-to-receive-from-server"
                })
            }
            else {
                const tangents = await fetchLatestTangentPosts(point.mentionedIn);
                console.log("tangents in async", tangents);

                let usersInLatestPosts = [];
                tangents.forEach((post) => {
                    usersInLatestPosts.push(post.userId);
                });

                const users = [...new Set(usersInLatestPosts)];
                console.log("usersin", users);

                if (users.length > 0) {
                    console.log("fetching users");
                    await fetchUsers(users);
                }
                else {
                    dispatch({
                        type: "no-users-data-to-receive-from-server"
                    })
                }
            }
            })();
    }, [currentUser])

   
    // if (!state.point || !state.tangents || !state.users) {
    if (currentUserStatus === "loading" || state.pointStatus === "loading" || state.tangentsStatus === "loading" || state.usersStatus === "loading") {
        return (
            <PageWrapper>
                <Header>point</Header>
            </PageWrapper>
        )
    }
    return (
        <PageWrapper>
            <Header>{state.point.title}</Header>
            <PointPreview _id={state.point._id} coverImgSrc={state.point.coverImgSrc} title={state.point.title} 
            type={state.point.type} by={state.point.by} year={state.point.year} description={state.point.description} 
            link={state.point.link} format="full" userPoints={currentUser.points}/>
            <MentionedDiv>mentioned in these Tangents</MentionedDiv>
            {state.tangents.map((post) => {
                let text = "";
                if (Object.keys(post).indexOf("pointId") > -1) {
                    const point = state.points.find((item) => item._id === post.pointId);
                    text = `POINT: ${point.title} (${point.year}), ${point.by} - ${point.type}`; 
                }
                else {
                    text = post.text;
                }
                console.log("state.users", state.users)
                const user = state.users.find((user) => user._id === post.userId)
                return (
                    <Wrapper>
                        <h4>{post.tangentName}</h4>
                        <TangentPreview tangentId={post.tangentId} text={text}
                        imgSrc={user.avatar} username={user.username} timestamp={post.timestamp}/>
                    </Wrapper>
                )
            })
            }
        </PageWrapper>
    )
}

const MentionedDiv = styled.h4`
    margin: 10px auto;
    font-style: italic;
`;

const Wrapper = styled.div`
    padding: 25px 0;
    border-bottom: 2px solid var(--color-secondary);
    border-radius: 0px;
    
    h4 { 
        margin-left: 25px;
    }
`;

export default PointDetails;