import styled from "styled-components";
import { useReducer, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "./TangentPreview";
import Header from "./Header";

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
                pointStatus: "failed",
                pointsError: action.error,
            }
        }
    }
}

const PointsInTangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);

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
    }, [])

    if (state.pointStatus === "loading") {
        return <PageWrapper>
        <Header titleSize="smaller">points in tangent</Header>
    </PageWrapper>
    }

    return (
        <PageWrapper>
            <Header titleSize="smaller">points in tangent</Header>
            {state.points.map((point) => {
                return <StyledNavLink to={`/points/${point._id}`} key={point._id}>
                    <PointPreview coverImgSrc={point.coverImgSrc} title={point.title} type={point.type} 
                    by={point.by} year={point.year} format="short"/>
                </StyledNavLink>
            })}
        </PageWrapper>
    )
}

const StyledNavLink=styled(NavLink)`
    width: 100%;
`;

export default PointsInTangent;