import styled from "styled-components";
import { useReducer, useEffect, useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import PointPreview from "./PointPreview";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    points: null,
    pointsStatus: "loading",
    pointsError: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("receive-points-from-server"): {
            return {
                ...state, 
                points: action.points, 
                pointsStatus: "idle", 
            }
        }

        case ("failure-loading-points-from-server"): {
            return {
                ...state,
                pointsStatus: "failed",
                pointsError: action.error,
            }
        }
    }
}

const PointsInTangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);
    const { state: { currentUser, currentUserStatus}} = useContext(CurrentUserContext);
    const { changeCount } = useContext(GlobalContext);
    const [state, dispatch] = useReducer(reducer, initialState);

    //fetch all Points in the Tangent

    useEffect(() => {

        console.log("about to fetch")
        fetch("/tangent/points", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "_id": `${tangentId}`
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("pointse data", data)
            if (data.status === 200) {
                dispatch({
                    type: "receive-points-from-server",
                    points: data.data
                })
            }
            else (
                dispatch ({
                    type: "failure-loading-points-from-server",
                    error: data.message
                })
            )
        })
        .catch((err) => {
            dispatch ({
                type: "failure-loading-points-from-server",
                error: err
            })
        })
    }, [changeCount])

    if (state.pointsStatus === "loading" || currentUserStatus === "loading" || !state.points) {
        return <PageWrapper>
        <LoadingComponent />
    </PageWrapper>
    }

    
    return (
        <PageWrapper>
            <Body>
            {/* <Header titleSize="smaller">points in tangent</Header> */}
            {state.points.map((point) => {
                return (
                    <PointDiv key={point._id} >
                        <PointPreview key={point._id} _id={point._id} coverImgSrc={point.coverImgSrc} title={point.title} type={point.type} 
                        by={point.by} year={point.year} format="short" userPoints={currentUser.points}/>
                    </PointDiv>
                )
            })}
            <Spacer></Spacer>
            </Body>
        </PageWrapper>
    )

}

const PointDiv=styled.div`
    width: 100%;
`;

const Body = styled.div`
    overflow: scroll;
`;

const Spacer = styled.div`
    height: 70px;
`;
export default PointsInTangent;