//Modal to add a new Tangent

import styled from "styled-components";
import { useReducer, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    tangentName: null,
    firstPost: null,
    postServerStatus: "idle", //sending, success, failed
    error: null, 
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("update-tangent-name-input"): {
            return {
                ...state, 
                tangentName: action.tangentName
            }
        }

        case ("update-first-post-input"): {
            return {
                ...state,
                firstPost: action.firstPost
            }
        }

        case ("sending-to-server"): {
            return {
                ...state, 
                postServerStatus: "sending",
            }
        }

        case ("tangent-successfully-posted"): {
            return {
                ...state,
                postServerStatus: "success"
            }
        }

        case ("tangent-post-error"): {
            return {
                ...state, 
                postServerStatus: "failed", 
                error: action.error
            }
        }

        case ("form-error") : {
            return {
                ...state, 
                error: action.error
            }
        }

        case ("reset-error") : {
            return {
                ...state, 
                error: null, 
            }
        }
    }
}
const AddTangentModal = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);
    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    const { showNewTangentModal, setShowNewTangentModal, changeCount, setChangeCount } = useContext(GlobalContext);

    const nodeRef = useRef();
    let navigate = useNavigate();

    const handleAddTangent = (e) => {
        e.preventDefault();

        if (state.tangentName.length === 0 || state.tangentName === null || 
            state.firstPost.length === 0 || state.firstPost === null ) {
                dispatch ({
                    type: "form-error", 
                    error: "You must enter a Tangent name and your first post!"
                })
                return;
        }

        dispatch ({
            type: "sending-to-server"
        })

        const newTangentPost = {
            tangentName: state.tangentName,
            currentUserId: currentUser._id,
            text: state.firstPost
        }

        fetch("/tangents/add-tangent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(newTangentPost)
            
            })
            .then(res => res.json())
            .then(data => {

                if (data.status === 200) {
                    dispatch ({
                        type: "tangent-successfully-posted"
                    })
                    //go to newly created Tangent
                    navigate(`/tangent/${data.data}`);
                    setShowNewTangentModal(false);
                    setChangeCount(changeCount+1);
                }
                else {
                        dispatch({
                            type: "tangent-post-error",
                            error: "Error during post to server -- please try again."
                        })
                }
            })
            .catch((err) => {
                dispatch({
                    type: "tangent-post-error",
                    error: "Error during post to server -- please try again."
                })
               
            })
    }

    const handleClose = () => {
        setShowNewTangentModal(false);
    }

    // window.onclick = function(event) {
    //     if (nodeRef.current && !nodeRef.current.contains(event.target)) {
    //         setShowNewTangentModal(false);
    //     }
    // }
    

    if (currentUserStatus === "loading") {
        return <div></div>;
    }

    return (
        <Wrapper isDisplay={showNewTangentModal} ref={nodeRef}>
            <Content>
            <CloseDiv>
                <CloseButton onClick={handleClose}>&times;</CloseButton>
            </CloseDiv>
            <h2>add tangent</h2>
            <form onSubmit={(e) => handleAddTangent(e)}>
                <label><p>tangent name:</p>
                    <input type="text"
                        onChange={(e) => {
                            dispatch ({
                                type: "update-tangent-name-input", 
                                tangentName: e.target.value
                            })
                            dispatch ({
                                type: "reset-error"
                            })
                        }}/>
                </label>

                <label><p>start the conversation:</p>
                    <textarea rows="4" type="text"
                        onChange={(e) => {
                            dispatch ({
                                type: "update-first-post-input", 
                                firstPost: e.target.value
                            })
                            dispatch ({
                                type: "reset-error"
                            })
                    }}/>
                </label>
            
                <ErrorMsg>{state.error}</ErrorMsg>
                <input disabled={(!state.tangentName || !state.firstPost)}type="submit" className="button" value="post!" />
            </form>
            </Content>
         </Wrapper>
    )
}

const Wrapper = styled.div`
    display: ${props => (props.isDisplay ? 'block' : 'none')};
    position: fixed; 
    z-index: 100; 
    top: 60px;


    h2 { 
        color: var(--color-secondary);
        padding-bottom: 10px;
        border-bottom: 5px solid var(--color-highlight);
        width: 100%;
        text-align: center;
    }
    form {
        display: flex;
        flex-direction: column;
        padding: 15px;
        align-items: center;
        width: 90%;
        margin-top: 10px;

        * {
            margin: 5px 0;
        }
    }
    
    p {
        color: var(--color-main);
        font-size: 18px;
        width: 110px;
        font-family: var(--font-heading);
        padding: 10px 0;
    }

    label {
        display: flex;
        justify-content: center;
    }


    textarea, input {
        border-radius: 25px;
        background-color: var(--color-main-transparent);
        border: none;
        resize: none;
        outline: none;
        width: 190px;
        font-size: 16px;
        font-family: var(--font-body);
        padding: 10px 5px;
        color: white;
    }

    .button {
        background-color: var(--color-main);
    }
`;

const Content = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 0;
    border: 5px solid var(--color-highlight);
`;

const CloseDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 80%;
`;

const CloseButton = styled.div`
    color: var(--color-main);
    font-size: 20px;
    cursor: pointer;
`;
const ErrorMsg = styled.p`
    margin: 3px;
`;

export default AddTangentModal;