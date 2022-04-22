import styled from "styled-components";
import { useContext, useEffect, useReducer } from "react";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import UserPreview from "./UserPreview";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import LoadingComponent from "../GeneralPageComponents/LoadingComponent";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    circle: null,
    status: "loading",
    error: null
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("receive-circle-from-server"): {
            return {
                ...state, 
                circle: action.circle, 
                status: "idle", 
            }
        }

        case ("failure-loading-circle-from-server"): {
            return {
                ...state,
                status: "failed",
                error: action.error,
            }
        }

        default : {
            return {
                ...state
            }
        }
    }
}
const MyCircle = () => {
    const { state: { currentUser, currentUserStatus} } = useContext(CurrentUserContext);
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { changeCount } = useContext(GlobalContext);

    useEffect(() => {

        if (currentUserStatus === "idle") {
        fetch("/users/get-user-circle", {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "_id": `${currentUser._id}`
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                if (data.data[0] == null) {
                    dispatch({
                        type: "receive-circle-from-server",
                        circle: []
                    })
                }
                else {
                    dispatch({
                        type: "receive-circle-from-server",
                        circle: data.data
                    })
                }
                
            }
            else (
                dispatch ({
                    type: "failure-loading-circle-from-server",
                    error: data.message
                })
            )
        })
        .catch((err) => {
            dispatch ({
                type: "failure-loading-circle-from-server",
                error: err
            })
        })
    }
    }, [currentUser, changeCount])

    if (state.status === "loading" || currentUserStatus === "loading") {
        return <PageWrapper>
        <LoadingComponent />
        </PageWrapper>
    }

    return (
        <PageWrapper>
            <Body>
                {(state.circle.length === 0) ? (
                    <h4>no one in your circle!</h4>
                ) : (
                    <>
                    {state.circle.map((friend) => 
                        <UserPreview key={friend._id} circle={currentUser.circle} _id={friend._id} username={friend.username} 
                        tagline={friend.tagline} imgSrc={friend.avatar}/>
                    )}
                    </>
                )}
            <Spacer></Spacer>
            </Body>
        </PageWrapper>
    )
}

const Body = styled.div`
    overflow: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;

    h4 {
        margin: 20px auto;
        font-style: italic;

    }
`;

const Spacer = styled.div`
    height: 70px;
`;

export default MyCircle;