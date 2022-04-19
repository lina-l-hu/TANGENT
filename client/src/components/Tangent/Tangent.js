import styled from "styled-components";
import { useEffect, useReducer, useContext, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import PageWrapper from "../PageWrapper";
import Textbox from "./Textbox";
import Message from "./Message";
import Header from "../Header";
import PointPreview from "../PointPreview";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import { GlobalContext } from "../GlobalContext";

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
    }
}
//Each Tangent component is a chat thread
const Tangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);
    const { state: { currentUser, currentUserStatus }} = useContext(CurrentUserContext);
    const { changeCount, setChangeCount } = useContext(GlobalContext);
    
    const [ state, dispatch ] = useReducer(reducer, initialState);

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
            console.log("all fetch data", data);
            dispatch({
                type: "successfully-fetched-all-data",
                tangentFetchStatus: data[0].status, 
                tangent: data[0].data,
                points: data[1].data,
                users: data[2].data
            })
        }).catch((err) => {
            console.log(err);
            dispatch({
                type: "failure-fetching-all-data",
                error: err
            })
        });
    }, [changeCount])

    if (state.status === "loading" || currentUserStatus === "loading") {
        return <PageWrapper>
            {/* <Header>tangent</Header> */}
        </PageWrapper>
    }

    if (state.tangentFetchStatus !== 200) {
        return <PageWrapper>
        {/* <Header>tangent</Header> */}
        <Error>Tangent not found!</Error>
    </PageWrapper>
    }

    return (
        <PageWrapper>
            {/* <Header titleSize="smaller">{state.tangent[0].tangentName}</Header> */}
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
                            return <Message key={post._id} text={post.text} avatarImgSrc={user.avatar} username={user.username} 
                            timestamp={post.timestamp}/>
                        }
                        else {
                            //find point in the points array and display
                            const point = state.points.find((item) => item._id === post.pointId);
                            return (
                                <PointDiv key={point._id}>
                                    <PointPreview key={point._id} _id={point._id} coverImgSrc={point.coverImgSrc} title={point.title} type={point.type} 
                                    by={point.by} year={point.year} format="short" userPoints={currentUser.points}/>
                                </PointDiv>
                            )
                        }
                    })}
                </Messages>
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
    /* margin-top: 15px; */
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