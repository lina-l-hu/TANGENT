import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import { NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import Header from "./Header";
import TangentPreview from "./TangentPreview";
import PointPreview from "./PointPreview";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

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
    }
}

const FeedPage = () => {

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    
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

            //fetch the 3 most recently active Tangents in the user's circle
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
            console.log("all fetch data", data);
            dispatch({
                type: "successfully-fetched-all-data",
                popularPoint: data[0].data,
                popularTangent: data[1].data,
                recentTangents: data[2].data
            })
        }).catch((err) => {
            console.log(err);
            dispatch({
                type: "failure-fetching-all-data",
                error: err
            })
        });
    }
    }, [currentUser])

    if (state.status === "loading") {
        return <PageWrapper>
            {/* <Header>feed</Header> */}
        </PageWrapper>
    }

    return (
    <PageWrapper>
        {/* <Header>feed</Header> */}
        <Body>
            <MostPopularPoint className="section">
                <SectionTitle>Talk of the day</SectionTitle>
                    <PointPreview _id={state.popularPoint._id} coverImgSrc={state.popularPoint.coverImgSrc} 
                    title={state.popularPoint.title} by={state.popularPoint.by} year={state.popularPoint.year} 
                    format="short" userPoints={currentUser.points}/>
            </MostPopularPoint>

            <MostPopularTangent className="section">
                <SectionTitle>Major discussions</SectionTitle>
                <TangentPreview key={state.popularTangent._id} tangentId={state.popularTangent._id} timestamp={state.popularTangent.timestamp} 
                username={state.popularTangent.username} avatar={state.popularTangent} text={state.popularTangent.text}/>
            </MostPopularTangent>

            <NewTangents className="section">
                <SectionTitle>Something to add?</SectionTitle>
                {state.recentTangents.map((post) => {
                    return <TangentPreview key={post._id} tangentId={post._id} timestamp={post.timestamp}
                    username={post.username} avatar={post.avatar} text={post.text}/>
                })}
            </NewTangents>

        <Spacer></Spacer>
        </Body>
        
    </PageWrapper>
    )
}

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