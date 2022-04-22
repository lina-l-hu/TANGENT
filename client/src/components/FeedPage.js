//Feed page that loads after login
//Displays previews of the most popular Point and Tangent, and most recent Tangent

import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import PageWrapper from "./GeneralPageComponents/PageWrapper"
import TangentPreview from "./Tangent/TangentPreview";
import PointPreview from "./PointComponents/PointPreview";
import { CurrentUserContext } from "./Profile/CurrentUserContext";
import LoadingComponent from "./GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "./GlobalContext";

const initialState = {
    status: "loading",
    popularPoint: null,
    popularTangent: null, 
    recentTangents: null,
    error: null,
}

const reducer = (state, action) => {
    switch (action.type) {

        case ("successfully-fetched-all-data") : {
            return {
                ...state, 
                status: "idle",
                popularPoint: action.popularPoint, 
                popularTangent: action.popularTangent,
                recentTangents: action.recentTangents
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

const FeedPage = () => {

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    const { changeCount } = useContext(GlobalContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);

    useEffect(() => {

        if (currentUserStatus === "idle") {
        
            Promise.all([

                //fetch the most referenced Point in the user's circle
                fetch("/points/most-popular", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                        "_id": `${currentUser._id}`
                    },
                }),

                //fetch the Tangent with the most posts in the user's circle
                fetch("/tangents/most-popular-tangent", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                        "_id": `${currentUser._id}`
                    },
                }),

                //fetch the most recently active Tangents in the user's circle
                fetch("/tangents/most-recent-tangents", {
                    method: "GET", 
                    headers: {
                        "Content-Type": "application/json",
                        "_id": `${currentUser._id}`
                    },
                })

            ]).then((responses) =>  {
                return Promise.all(responses.map((response) => {
                    return response.json();
                }));
            }).then((data) => {
                dispatch({
                    type: "successfully-fetched-all-data",
                    popularPoint: data[0].data,
                    popularTangent: data[1].data,
                    recentTangents: data[2].data
                })
            }).catch((err) => {
                dispatch({
                    type: "failure-fetching-all-data",
                    error: err
                })
            });
        }
    }, [currentUser, changeCount])

    if (state.status === "loading") {
        return <PageWrapper>
            <LoadingComponent />
        </PageWrapper>
    }

    if (state.popularPoint.length === 0 || state.popularTangent.length === 0 ) {
        return <PageWrapper>
            <NoFriends>Add friends to your circle to see some action!</NoFriends>
            </PageWrapper>
    }

    return (
    <PageWrapper>
        <Body>
            <MostPopularPoint className="section">
                <SectionTitle>Talk of the day</SectionTitle>
                    <PointPreview _id={state.popularPoint._id} coverImgSrc={state.popularPoint.coverImgSrc} 
                    title={state.popularPoint.title} by={state.popularPoint.by} year={state.popularPoint.year} 
                    format="short" userPoints={currentUser.points}/>
            </MostPopularPoint>

            <MostPopularTangent className="section">
                <SectionTitle>Major discussions</SectionTitle>
                <TangentPreview tangentId={state.popularTangent.tangentId} timestamp={state.popularTangent.timestamp} 
                username={state.popularTangent.username} text={state.popularTangent.text}/>
            </MostPopularTangent>

            <NewTangents className="section">
                <SectionTitle>Something to add?</SectionTitle>
                <TangentPreview key={state.recentTangents[0]._id} tangentId={state.recentTangents[0].tangentId} timestamp={state.recentTangents[0].timestamp}
                    username={state.recentTangents[0].username} text={state.recentTangents[0].text}/>
                {/* {state.recentTangents.map((post) => {
                    return <TangentPreview key={post._id} tangentId={post.tangentId} timestamp={post.timestamp}
                    username={post.username} imgSrc={post.avatar} text={post.text}/>
                })} */}
            </NewTangents>

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

const Body = styled.div`
    overflow: scroll;

    .section {
        margin: 30px 0;
        color: white;
    }
`;

const Spacer = styled.div`
    height: 70px;
`;

const SectionTitle = styled.h3`
    text-align: center;
    font-style: italic;
`;

const MostPopularPoint = styled.div`
`;

const MostPopularTangent = styled.div`

`;

const NewTangents = styled.div`
`;

export default FeedPage;