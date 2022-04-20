//Page that lists all tangents for a user
import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import TangentPreview from "../Tangent/TangentPreview";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    tangents: null, 
    tangentsStatus: "loading",
    tangentsError: null,
    points: null,
    pointsStatus: "loading",
    pointsError: null,
    users: null, 
    usersStatus: "loading", 
    usersError: null,
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
//A list of the current user's Tangents
const MyTangents = () => {

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    const { changeCount } = useContext(GlobalContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);

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
        }

        catch (err) {
            dispatch ({
                type: "failure-loading-points-data-from-server",
                error: err
            })
        }
    }

    //make an array of the user's who authored each of the last posts fetched, 
    //and fetch these users to get their avatar and username info
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

    //fetch the latest post for each of the user's tangents
    //then fetch the Points that are referenced in the array of tangents' latests posts just fetched
    useEffect(() => {

        (async () => {
            if (currentUserStatus === "idle") {
                const tangents = await fetchLatestTangentPosts();

                let pointsReferenced = [];
                let usersInLatestPosts = [];
                tangents.forEach((post) => {
                    usersInLatestPosts.push(post.userId);
                    if (post.pointId) {
                        pointsReferenced.push(post.pointId);
                    }
                })

                //get rid of duplicates in both arrays
                const points = [...new Set(pointsReferenced)];
                const users = [...new Set(usersInLatestPosts)];

                if (points.length > 0) {
                    fetchPoints(points);
                }
                else {
                    dispatch({
                    type: "no-points-data-to-receive-from-server"
                })
                }

                if (users.length > 0) {
                    fetchUsers(users);
                }
                else {
                    dispatch({
                    type: "no-users-data-to-receive-from-server"
                })
                }

            }
        })();

    }, [currentUser, changeCount]);


    if (currentUserStatus === "loading" || state.pointsStatus === "loading" || state.usersStatus === "loading") {
        return <PageWrapper>
            <LoadingComponent />
        </PageWrapper>
    }

    if (!state.tangents) {
        return <PageWrapper>
            <NoFriends>Add friends to your circle to see some action!</NoFriends>
            </PageWrapper>
    }

    return (
        <PageWrapper>
            {/* <Header>my tangents</Header> */}
            <Body>
            {state.tangents.map((post) => {
                let text = "";
                if (Object.keys(post).indexOf("pointId") > -1) {
                    const point = state.points.find((item) => item._id === post.pointId);
                    text = `POINT: ${point.title} (${point.year}), ${point.by} - ${point.type}`; 
                }
                else {
                    text = post.text;
                }
                const user = state.users.find((user) => user._id === post.userId)
                return (
                    <Wrapper key={post._id} >
                    <h4>{post.tangentName}</h4>
                        <TangentPreview tangentId={post.tangentId} text={text}
                        username={user.username} timestamp={post.timestamp}/>
                    </Wrapper>
                )
            })
            }
            <Spacer></Spacer>
            </Body>
        </PageWrapper>
    )
}

const NoFriends = styled.div`
    display: flex;
    justify-content: center;
    margin: 30x auto;
    font-family: var(--font-subheading);
    color: white;
    font-size: 20px;
    padding: 30px;
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

const Body = styled.div`
    overflow: scroll;
`;

const Spacer = styled.div`
    height: 70px;
`;

export default MyTangents;