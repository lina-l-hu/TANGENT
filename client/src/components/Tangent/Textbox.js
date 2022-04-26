//Text input component to send message or search for Point used on Tangent page

import styled from "styled-components";
import { useRef, useReducer, useState, useContext } from "react";
import PointSuggestionDropup from "./PointSuggestionDropup";
import PointInput from "./PointInput";
import { GlobalContext } from "../GlobalContext";
import ErrorModal from "./ErrorModal";
import ButtonLoadingComponent from "../GeneralPageComponents/ButtonLoadingComponent";

const initialState = {
    textAreaInput: "",
    pointSuggestionsFetchStatus: "idle",
    pointSuggestions: null,
    pointPostStatus: "idle",
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
        
        case ("fetching-matches") : {
            return {
                 ...state,
                pointSuggestionsFetchStatus: "fetching", 
            }
           
        }

        case ("successfully-fetched-matches") : {
            return {
                ...state, 
                pointSuggestionsFetchStatus: "success", 
                pointSuggestions: action.matches,
            }
        }

        case("error-during-matches-fetch") : {
            return {
                ...state,
                pointSuggestionsFetchStatus: "error",
                error: action.error,
            }
        }

        case ("posting-point") : {
            return {
                ...state,
                pointPostStatus: "sending"
            }
        }

        case ("successfully-posted-point") : {
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

        case ("posting-text-msg") : {
            return {
                ...state,
                textMsgPostStatus: "sending",
            }
        }

        case ("successfully-posted-text-msg") : {
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

        default : {
            return {
                ...state,
            }
        }
    }
}

const Textbox = ({currentUserId, currentTangentId}) => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    //3 modes: text, search, and suggestion
    //default mode is text (i.e. searchMode === false)
    const [ mode, setMode ] = useState("text");
    
    const [ displaySuggestionsDropup, setDisplaySuggestionsDropup ] = useState(false);
    const [ displayErrorModal, setDisplayErrorModal ] = useState(false);
    const [ selectedMatch, setSelectedMatch ] = useState(null);
    const { changeCount, setChangeCount } = useContext(GlobalContext);
    const textAreaRef = useRef();
    const [ lastSearchTerm, setLastSearchTerm ] = useState(null);

    const handleInput = (e) => {
        dispatch({
            type: "update-text-input",
            text: e.target.value
        })
        if (e.target.value[0] === "#") {
            setMode("search");
        }
        else {
            setMode("text");
        }
    }

    //to handle adding a text to the Tangent
    const handleSendText = () => {
        dispatch ({
            type: "posting-text-msg"
        })

        const messagePost = {
            currentUserId: currentUserId, 
            currentTangentId: currentTangentId,
            text: state.textAreaInput
        }

        fetch("/tangent/add-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(messagePost)
            
            })
            .then(res => res.json())
            .then(data => {
               if (data.status === 200) {
                   dispatch ({
                       type: "successfully-posted-text-msg"
                   })

                   setMode("text");
                   
                   dispatch({ 
                       type: "reset"
                   })
                   textAreaRef.current.value = "";
                   setChangeCount(changeCount+1);

               }
               dispatch({
                    type: "error-posting-text-msg",
                    error: "We couldn't post your message -- please try again!"
                })

            })
            .catch((err) => {
                dispatch({
                    type: "error-posting-text-msg",
                    error: "We couldn't post your message -- please try again!"
                })
               
            })
    }

    //search for a Point -- function calls a search function that searches both the mongoDB database of existing points
    //and the imdb and google books APIs for movies and books
    const handleFindPoint = () => {

        //if the searchTerm is not changed from when we last called a search fetch, display the results from the last search
        //instead of doing a new search
        if (lastSearchTerm === state.textAreaInput.slice(1).trim() && state.pointSuggestionsFetchStatus !== "error") {
            setDisplayErrorModal(false);
            setDisplaySuggestionsDropup(true);
            return;
        }
        
        dispatch ({
            type: "fetching-matches"
        })

        //save the search term in state
        setLastSearchTerm(state.textAreaInput.slice(1));

        //fetch Point suggestions from both the Points database and from the external movie and book APIs
        fetch(`/point-suggestions/?searchTerm=${state.textAreaInput.slice(1)}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {

            if (data.status === 200) {
                dispatch ({
                    type: "successfully-fetched-matches", 
                    matches: data.data, 
                })
                setDisplaySuggestionsDropup(true);
            }
            else {
                dispatch ({
                    type: "error-during-matches-fetch",
                    error: "We couldn't find any matches -- please try another search!"
                })
                setDisplaySuggestionsDropup(false);
                setDisplayErrorModal(true);
            }
        })
        .catch ((error) => {
            dispatch ({
                type: "error-during-matches-fetch",
                error: "Server error -- please try again!"
            })
            setDisplayErrorModal(true);
        })
    }

    const reset = () => {
        dispatch ({ 
            type: "reset"
        })
    }

    const setPointPostingError = (error) => {
        dispatch ({
            type: "error-posting-point", 
            error: error
        })
    }

    return (
        <Wrapper>
            
            <ErrorModal errorMessage={state.error} displayErrorModal={displayErrorModal} setDisplayErrorModal={setDisplayErrorModal} setDisplaySuggestionsDropup={setDisplaySuggestionsDropup}/>

            {(state.pointSuggestionsFetchStatus === "success" && mode !== "text" &&
                <PointSuggestionDropup suggestedMatches={state.pointSuggestions} mode={mode} setMode={setMode}
                selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} setDisplaySuggestionsDropup={setDisplaySuggestionsDropup}
                displaySuggestionsDropup={displaySuggestionsDropup}/>
            )}

            {(mode === "suggestion") &&
                <PointInput selectedMatch={selectedMatch} mode={mode} setMode={setMode} reset={reset}
                setDisplaySuggestionsDropup={setDisplaySuggestionsDropup} currentUserId={currentUserId} setPointPostingError={setPointPostingError}
                currentTangentId={currentTangentId} displayErrorModal={displayErrorModal} setDisplayErrorModal={setDisplayErrorModal}/>
            }
            

            {(mode !== "suggestion") && 
                <TextContainer>
                    <textarea ref={textAreaRef} rows="1"
                     onChange={handleInput}>
                     </textarea>

                    {(mode === "text") ? (

                    <button disabled={(state.textAreaInput.length === 0)}
                        onClick={handleSendText}>
                       {(state.pointSuggestionsFetchStatus === "fetching") ? (
                                <ButtonLoadingComponent />
                            ) : (
                                "add msg"
                            )
                            }
                    </button>
                    ) : (
                        <button disabled={(state.textAreaInput.length === 0)}
                        onClick={handleFindPoint}>
                            {(state.pointSuggestionsFetchStatus === "fetching") ? (
                                <ButtonLoadingComponent />
                            ) : (
                                "find point"
                            )
                            }
                    </button>
                    )}
                </TextContainer>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
`;

const TextContainer = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 auto;
    border-radius: 0;
    width: 100%;
    background: rgb(255,255,255);
    background: linear-gradient(0deg, rgba(255,255,255,1) 50%, rgba(255,255,255,0.7) 100%);
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
        padding: 10px;
        color: white;
    }

    button {
        font-size: 18px;
        padding: 8px;
        border-radius: 18px;
        width: 100px;
    }
`;

export default Textbox;