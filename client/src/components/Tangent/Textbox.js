import styled from "styled-components";
import { useRef, useReducer, useEffect, useState } from "react";


const initialState = {
    textAreaInput: "",
    apiFetchStatus: "idle",
    matchesFromApi: null,
    textMsgPostStatus: "idle",
    error: null, 
}

const reducer = (state, action) => {
    switch (action.type) {
        
        case ("update-text-input") : {
            return {
                ...state,
                textAreaInput: action.text,
            }
        }
        
        case ("fetching-matches-from-api") : {
            return {
                 ...state,
                apiFetchStatus: "fetching", 
            }
           
        }

        case ("successfully-fetched-from-api") : {
            return {
                ...state, 
                apiFetchStatus: "success", 
                matchesFromApi: action.matches,
            }
        }

        case("error-during-api-fetch") : {
            return {
                ...state,
                apiFetchStatus: "error",
                error: action.error,
            }
        }

        case ("posting-text-msg") : {
            return {
                ...state,
                textMsgPostStatus: "sending",
            }
        }

        case ("sucessfully-posted-text-msg") : {
            return {
                ...state,
                textMsgPostStatus: "success",
            }
        }

        case ("error-posting-text-msg") : {
            return {
                ...state, 
                textMsgPostStatus: "error",
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

const Textbox = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);
    const [ topResults, setTopResults ] = useState(null);
    const textRef = useRef();

    useEffect(() => {
        const updateInput = () => {
            dispatch ({
                type: "update-text-input",
                text: textRef.current.value,
            })
        }

        textRef.current.addEventListener("keyup", updateInput);

        return () => {
            textRef.current.removeEventListener("keyup", updateInput);
        }

    }, []);

    const handleSendText = () => {

    }

    const handleAddItem = () => {

        console.log("calling fetch")

        dispatch ({
            type: "fetching-matches-from-api"
        })

        console.log("searchTerm in front", state.textAreaInput.slice(1))
            //from each API, return the top 3 results
            //also search for an existing point with the same title
    //results stored in state
    //user sees all results in a dropup or tippy
    //user chooses one
    //post to server the chosen's info + tangentID to make new point object in database, returns ID
    //in same handler, ID is added to tangent object array
    //tangent should rerender with this new point added as a pointPreview
        fetch(`/point-suggestions/?searchTerm=${state.textAreaInput.slice(1)}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                // "searchTerm": `${state.textAreaInput}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data from api FE", data)

            if (data.status === 200) {
                dispatch ({
                    type: "successfully-fetched-from-api", 
                    matches: data, 
                })
            }
            else {
                dispatch ({
                    type: "error-during-api-fetch",
                    error: data.message,
                })
            }
        })
        .catch ((error) => {
            dispatch ({
                type: "error-during-api-fetch",
                error: error,
            })
        })
    }

    return (
        <Wrapper>
            <textarea ref={textRef} autoFocus rows="1"></textarea>
            <button disabled={(state.textAreaInput.length === 0)} 
                onClick={(state.textAreaInput[0] === "#") ? handleAddItem : handleSendText}>
                {(state.textAreaInput[0] === "#") ? "add" : "send"}
            </button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
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
        width: 73%;
        font-size: 20px;
        font-family: var(--font-body);
        padding: 10px 5px;
        color: white;
    }

    button {
        font-size: 20px;
        padding: 8px 12px;
        border-radius: 18px;
        width: 60px;
    }
`;

export default Textbox;