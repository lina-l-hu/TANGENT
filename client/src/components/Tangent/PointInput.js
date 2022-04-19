import styled from "styled-components";
import { useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../GlobalContext";

const initialState = {
    pointPostStatus: "idle",
    error: null, 
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("posting-point") : {
            return {
                ...state,
                pointPostStatus: "sending"
            }
        }

        case ("sucessfully-posted-point") : {
            return {
                ...state,
                pointPostStatus: "success",
            }
        }

        case ("error-posting-point") : {
            return {
                ...state, 
                pointPostStatus: "error",
                error: action.error,
            }
        }

        case ("reset") : {
            return {
                ...initialState
            }
        }
    }
}


const PointInput = ({currentUserId, currentTangentId, selectedMatch, 
    reset, mode, setMode, setDisplaySuggestionsDropup}) => {

    const [ state, dispatch ] = useReducer(reducer, initialState);
    const {changeCount, setChangeCount} = useContext(GlobalContext);

    const handleAddPoint = () => {
        //close dropup
        setDisplaySuggestionsDropup(false);

        dispatch ({
            type: "posting-point"
        })

        //add currentTangentId and currentUserId to the object posted to server
        const pointPost = {...selectedMatch, currentTangentId: currentTangentId, currentUserId: currentUserId};

        fetch("/tangent/add-point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(pointPost)
            
            })
            .then(res => res.json())
            .then(data => {
               if (data.status === 200) {
                   dispatch ({
                       type: "successfully-posted-point"
                   })

                   setChangeCount(changeCount+1);

                   setMode("text");
                   reset();
               }
               else {
                    //if error, open dropup again
                setDisplaySuggestionsDropup(true);
               }
            })
            .catch((err) => {
                dispatch({
                    type: "error-posting-point",
                    error: err
                })

                //if error, open dropup again
                setDisplaySuggestionsDropup(true);
               
            })

    }


    return (
        <Wrapper>
            <Overlay>
                <CloseButton onClick={() => {
                    setMode("text");
                }}>x</CloseButton>
                <PointButton onClick={() => {
                    setDisplaySuggestionsDropup(true);
                }}>
                    {"#" + selectedMatch.title + " (" + selectedMatch.type + "), " + selectedMatch.year} </PointButton>
            </Overlay>
            <TextContainer>
                <textarea rows="1" disabled></textarea>
                <button 
                    onClick={handleAddPoint}>
                    add point
                </button>
            </TextContainer>
        </Wrapper>
    )
}

const Wrapper = styled.div`
`;

const Overlay = styled.div`
    position: absolute;
    z-index: 10;
    bottom: 20px;
    left: 15px;

    button {
        background-color: var(--color-highlight);
        font-family: var(--font-body);
        font-size: 16px;
        margin: 0 5px;
    }
`;

const CloseButton = styled.button`
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: inline-flex;
    align-items: center; 
    justify-content: center;
`;

const PointButton = styled.button`
    border-radius: 30px;
    padding: 5px 10px;
    max-width: 210px;
    height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    /* display: inline-block; */
`;

const TextContainer = styled.div`
    /* border: 2px solid white; */
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 auto;
    border-radius: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    /* height: 50px; */
    padding: 12px 5px;

    textarea {
        border-radius: 30px;
        background-color: var(--color-main-transparent);
        border: none;
        resize: none;
        outline: none;
        width: 68%;
        font-size: 20px;
        font-family: var(--font-body);
        padding: 10px 5px;
        color: white;
    }

    button {
        font-size: 18px;
        padding: 8px;
        border-radius: 18px;
        width: 100px;
    }
`;


export default PointInput;