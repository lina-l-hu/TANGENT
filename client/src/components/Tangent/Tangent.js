//A Tangent, i.e. chat

import styled from "styled-components";
import { useEffect, useReducer, useContext, useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import Textbox from "./Textbox";
import Message from "./Message";
import PointPreview from "../PointComponents/PointPreview";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import { GlobalContext } from "../GlobalContext";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";

const initialState = {
    status: "loading",
    tangentFetchStatus: null,
    tangent: null, 
    points: null,
    users: null,
    error: null,
}

const reducer = (state, action) => {
    switch (action.type) {

        case ("successfully-fetched-all-data") : {
            return {
                ...state, 
                status: "idle",
                tangentFetchStatus: action.tangentFetchStatus,
                tangent: action.tangent, 
                points: action.points,
                users: action.users
            }
        }

        case ("failure-fetching-all-data") : {
            return {
                ...state, 
                status: "failed-fetch",
                error: action.error
            }
        }   
        
        default : {
            return {
                ...state
            }
        }
    }
}
//Each Tangent component is a chat thread
const Tangent = () => {

    const { tangentId } = useParams();
    const { state: { currentUser, currentUserStatus }} = useContext(CurrentUserContext);
    const { changeCount } = useContext(GlobalContext);
    
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    useEffect(() => {
      scrollToBottom()
    }, [changeCount]);
  

    useEffect(() => {

        Promise.all([

            //fetch all the posts in the Tangent
            fetch(`/tangents/${tangentId}`, {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                },
            }),

            //fetch all the points in the Tangent
            fetch("/tangent/points", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "_id": `${tangentId}`
                },
            }),

            //fetch all the users in the Tangent
            fetch("/tangent/users", {
                method: "GET", 
                headers: {
                    "Content-Type": "application/json",
                    "_id": `${tangentId}`
                },
            })

        ]).then((responses) =>  {
            return Promise.all(responses.map((response) => {
                return response.json();
            }));
        }).then((data) => {
            dispatch({
                type: "successfully-fetched-all-data",
                tangentFetchStatus: data[0].status, 
                tangent: data[0].data,
                points: data[1].data,
                users: data[2].data
            })
        }).catch((err) => {
            dispatch({
                type: "failure-fetching-all-data",
                error: err
            })
        });
    }, [changeCount])


    if (state.status === "loading" || currentUserStatus === "loading") {
        return <PageWrapper>
            <LoadingComponent />
        </PageWrapper>
    }

    if (state.tangentFetchStatus !== 200) {
        return <PageWrapper>
        <Error>Tangent not found!</Error>
    </PageWrapper>
    }

    return (
        <PageWrapper>
            <Body>
                <LinkDiv>
                    <h4>{state.tangent[0].tangentName}</h4>
                    <AllPointsLink to={`/${tangentId}/points`}>all Points mentioned</AllPointsLink>
                </LinkDiv>
                <Messages>
                    {state.tangent.map((post) => {
                        //find user associated with this message by id
                        const user = state.users.find((user) => user._id === post.userId);
                        if (post.text) {
                            return <Message key={post._id} userId={user._id} text={post.text} username={user.username} 
                            timestamp={post.timestamp}/>
                        }
                        else {
                            //find point in the points array and display
                            const point = state.points.find((item) => item._id === post.pointId);
                            return (
                                <PointDiv key={point._id}>
                                    <PointPreview _id={point._id} coverImgSrc={point.coverImgSrc} title={point.title} type={point.type} 
                                    by={point.by} year={point.year} format="short" userPoints={currentUser.points}/>
                                </PointDiv>
                            )
                        }
                    })}
                </Messages>
                <div ref={messagesEndRef} />
                <Spacer></Spacer>
            </Body>
                <Textbox currentTangentId={tangentId} currentUserId={currentUser._id} />
        </PageWrapper>
    )
}

const LinkDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px 0 10px;

    h4 {
        font-size: 24px;
        font-family: var(--font-body);
        font-style: italic;
        margin: 10px 0;
    }
`;
const AllPointsLink = styled(NavLink)`
    margin: 0 auto;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--color-main);
    border-radius: 20px;
`;

const Body = styled.div`
    overflow: scroll;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PointDiv = styled.div`
    width: 100%;
`;

const Error = styled.div`
    text-align: center;
    font-style: italic;
    font-family: var(--font-body);
    font-size: 30px;
    margin: 30px auto;
    color: white;
`

const Spacer = styled.div`
    height: 69.33px;
`;
export default Tangent;