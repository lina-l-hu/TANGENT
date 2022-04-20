import styled from "styled-components";
import { useReducer, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "../Tangent/TangentPreview";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "../GlobalContext";

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
    pointsInTangents: null, 
    pointsInTangentsStatus: "loading",
    pointsInTangentsError: null
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
                tangentsError: action.error,
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
                usersError: action.error,
            }
        }

        case ("receive-points-in-tangents-from-server"): {
            console.log("here,", state, action);
            return {
                ...state, 
                pointsInTangents: action.pointsInTangents, 
                pointsInTangentsStatus: "idle", 
            }
        }

        case ("failure-loading-points-in-tangents-from-server"): {
            return {
                ...state,
                pointsInTangentsStatus: "failed",
                pointsInTangentsError: action.error,
            }
        }

        default : {
            return {
                ...state,
            }
        }
    }
}

const PointDetails = () => {

    const { pointId } = useParams();
    console.log("pointid", pointId);

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    const { changeCount } = useContext(GlobalContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);
    // console.log("statuses", state.pointStatus, state.tangentsStatus, state.usersStatus);

    //fetch function to get point
    const fetchPoints = async (points) => {

        if (!pointId || pointId === undefined) {
            return;
        }

        const searchArray = (points) ? (points) : pointId;

        console.log("fetching point")
        try {
            const response = await fetch("/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "pointids": `${searchArray}`
                },
            })

            const data = await response.json();
            if (data.status === 200) {
                console.log(data)

                if (points) {
                    dispatch({
                    type: "receive-points-in-tangents-from-server",
                    pointsInTangents: data.data
                    })
                }
                else {
                    dispatch({
                        type: "receive-point-from-server",
                        point: data.data[0]
                    })
                }
                
                return data.data;
            }
            else {
                if (points) {
                    dispatch({
                        type: "failure-loading-points-in-tangents-from-server",
                        error: data.message
                    })
                    
                }
                else {
                    dispatch ({
                        type: "failure-loading-point-from-server",
                        error: data.message
                    })
                }
               
            }
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

        console.log("fetching latest tangentposts")
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
                    type: "receive-tangents-from-server",
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

        console.log("users")
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
            
            //first fetch to get the Point
            const point = await fetchPoints();
            console.log("point", point);

            if (point[0].mentionedIn.length === 0) {

                dispatch({
                    type: "receive-tangents-from-server",
                    tangents: []
                })
                dispatch({
                    type: "receive-users-data-from-server", 
                    users: []
                })
            }
            else {
             //second fetch to get the latest posts of every tangent in the Point mentionedIn array
                const tangents = await fetchLatestTangentPosts(point[0].mentionedIn);
                console.log("tangents in async", tangents);

                let usersInLatestPosts = [];
                let pointsInLatestPosts = [];
                tangents.forEach((post) => {
                    usersInLatestPosts.push(post.userId);
                    
                    if (Object.keys(post).indexOf("pointId") !== -1) {
                        pointsInLatestPosts.push(post.pointId);
                    }
                });

                const users = [...new Set(usersInLatestPosts)];
                console.log("usersin", users);

                const pointsInPosts = [...new Set(pointsInLatestPosts)];
                console.log("pointsinposts", pointsInPosts)
                //third fetch to get all the users in the tangents array fetched above
                if (users.length > 0) {
                    console.log("fetching users");
                    fetchUsers(users);
                }
                else {
                    dispatch({
                        type: "receive-users-data-from-server", 
                        users: []
                    })
                }

                //final fetch to get any other points that are mentioned in the tangent posts above
                //does not need result from users fetch
                if (pointsInPosts.length > 0) {
                    console.log("fetching tangents' points");
                    fetchPoints(pointsInPosts);
                }
                else {
                    dispatch({
                        type: "receive-points-in-tangents-from-server", 
                        pointsInTangents: []
                    })
                }
            }
            })();
    }, [currentUser, changeCount])
   
    if (currentUserStatus !== "idle" || state.pointStatus !== "idle" || state.tangentsStatus !== "idle" 
    || state.usersStatus !== "idle" || state.pointsInTangentsStatus !== "idle") {
        return (
            <PageWrapper>
                <LoadingComponent />
            </PageWrapper>
        )
    }
    return (
        <PageWrapper>
            <Body>
            
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
                console.log("userid", user._id, post.userId)
                return (
                    <Wrapper key={post._id}>
                        <h5>{post.tangentName}</h5>
                        <TangentPreview tangentId={post.tangentId} text={text}
                        timestamp={post.timestamp} imgSrc={user.avatar} username={user.username}/>
                    </Wrapper>
                )
            })
            }
            <Spacer></Spacer>
            </Body>
        </PageWrapper>
    )
}
{/* <TangentPreview key={post._id} tangentId={post.tangentId} text={text} */}
// imgSrc={user.avatar} username={user.username} timestamp={post.timestamp}/>

const MentionedDiv = styled.h3`
    margin: 10px auto;
    font-style: italic;
    text-align: center;
    padding-top: 20px;
`;

const Wrapper = styled.div`
    padding: 25px 0;
    /* border-bottom: 2px solid var(--color-secondary); */
    border-radius: 0px;
    
    h5 { 
        margin-left: 25px;
        font-family: var(--font-heading);
        margin-bottom: -10px;
        font-size: 18px;
        font-weight: bold;
    }
`;

const Body = styled.div`
    overflow: scroll;
`;

const Spacer = styled.div`
    height: 70px;
`;
export default PointDetails;