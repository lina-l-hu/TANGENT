import styled from "styled-components";
import { useContext, useReducer, useEffect } from "react";
import PageWrapper from "./PageWrapper";
import Header from "./Header";
import TangentPreview from "./TangentPreview";
import PointPreview from "./PointPreview";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

const initialState = {
    status: "loading",
    popularPoint: null,
    popularTangents: null, 
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
                popularTangents: action.popularTangents,
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
                popularTangents: data[1].data,
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
            <Header>feed</Header>
        </PageWrapper>
    }

    return (
    <PageWrapper>
        <Header>feed</Header>
        <Body>
            <MostPopularPoint className="section">
                <h3>Talk of the day</h3>
                <PointPreview />
            </MostPopularPoint>

            <MostPopularTangents className="section">
                <h3>Major discussions</h3>
                {/* get top 3 tangents and map over them to display */}
                <TangentPreview />
                <TangentPreview />
            </MostPopularTangents>

            <NewTangents className="section">
                <h3>Something to add?</h3>
                {/* get 2 most recent tangents from friends and map over them to display */}
                <TangentPreview />
                <TangentPreview />
            </NewTangents>
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

    h3 {
        text-align: center;
        font-style: italic;
    }
    
`;

const MostPopularPoint = styled.div`
`;

const MostPopularTangents = styled.div`

`;

const NewTangents = styled.div`
`;

export default FeedPage;