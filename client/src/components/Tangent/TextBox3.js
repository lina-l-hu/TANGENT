import styled from "styled-components";
import { useRef, useReducer, useEffect, useState, useContext } from "react";
import PointSuggestionDropup from "./PointSuggestionDropup";
import { CurrentTangentContext } from "./CurrentTangentContext";

const initialState = {
    textAreaInput: "",
    searchTermInput: "",
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

        case ("update-searchTerm-input") : {
            return {
                ...state,
                searchTermInput: action.searchTerm,
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
    const [ selectedMatch, setSelectedMatch ] = useState(null);
    const [ suggestionMode, setSuggestionMode ] = useState(false);
    const [ lastSearchTerm, setLastSearchTerm ] = useState(null);
    const textRef = useRef();
    const searchTermRef = useRef();
    const { displaySuggestionsDropup, setDisplaySuggestionsDropup } = useContext(CurrentTangentContext);
    const [textAreaMode, setTextAreaMode] = useState("text");
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ text, setText ] = useState("");

    useEffect(() => {
        const updateInput = () => {
            dispatch ({
                type: "update-text-input",
                text: textRef.current.value,
            })
        }

        // const updateSearchInput = () => {
        //     dispatch ({
        //         type: "update-searchTerm-input",
        //         searchTerm: searchTermRef.current.value
        //     })
        // }

        if (textAreaMode === "text") {
            textRef.current.addEventListener("keyup", updateInput);
        }

        // else if (textAreaMode === "findPoint") {
        //     searchTermRef.current.addEventListener("keyup", updateSearchInput);
        // }
        // return () => {
        //     textRef.current.removeEventListener("keyup", updateInput);
        // }

    }, []);

    const handleSendText = () => {
        dispatch ({
            type: "posting-text-msg"
        })

        //NEED TO ADD TANGENTID AND CURRENTUSERID

        fetch("/tangent/add-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(state.textAreaInput)
            
            })
            .then(res => res.json())
            .then(data => {
               if (data.status === 200) {
                   dispatch ({
                       type: "sucessfully-posted-text-msg"
                   })

                   //reset???
               }
            })
            .catch((err) => {
                dispatch({
                    type: "error-posting-text-msg",
                    error: err
                })
               
            })
    }

    const handleFindPoint = () => {

        //if the searchTerm is not changed from when we last called a search fetch
        // if (lastSearchTerm === state.searchTermInput.slice(1).trim()) {
        //     setDisplaySuggestionsDropup(true);
        //     console.log("last search", lastSearchTerm);
        //     //display the results from the last search
        //     console.log("display", displaySuggestionsDropup);
        //     return;
        // }
        console.log("searchTerm", searchTerm);
        console.log("calling fetch")

        dispatch ({
            type: "fetching-matches"
        })

        //save the search term in state
        setLastSearchTerm(searchTerm.slice(1));

        console.log("searchTerm in front", searchTerm.slice(1))

        //fetch Point suggestions from both the Points database and from the external movie and book APIs
        fetch(`/point-suggestions/?searchTerm=${searchTerm.slice(1)}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data from api FE", data)

            if (data.status === 200) {
                dispatch ({
                    type: "successfully-fetched-matches", 
                    matches: data.data, 
                })
                setDisplaySuggestionsDropup(true);
                // setSuggestionMode(true);
            }
            else {
                dispatch ({
                    type: "error-during-matches-fetch",
                    error: data.message,
                })
            }
        })
        .catch ((error) => {
            dispatch ({
                type: "error-during-matches-fetch",
                error: error,
            })
        })
    }

    const handleAddPoint = () => {
        dispatch ({
            type: "posting-point"
        })

        //close dropup
        setDisplaySuggestionsDropup(false);

             //NEED TO ADD TANGENTID AND CURRENTUSERID

        fetch("/tangent/add-point", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(selectedMatch)
            
            })
            .then(res => res.json())
            .then(data => {
               if (data.status === 200) {
                   dispatch ({
                       type: "sucessfully-posted-point"
                   })

                   //reset???
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

    const onSomething = (e) => {
        e.preventDefault();
        setDisplaySuggestionsDropup(true);
        console.log("HUKLLL");

    }

    const onChangeSuggestionMode = () => {
        setSuggestionMode(false);
        // textRef.current.value="";
    }

    return (
        <Wrapper>

            {(state.pointSuggestionsFetchStatus === "success" && displaySuggestionsDropup &&
                <PointSuggestionDropup suggestedMatches={state.pointSuggestions} suggestionMode={suggestionMode} setSuggestionMode={setSuggestionMode}
                selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />
            )}

            {( textAreaMode === "text" && 
                <TextContainer>
                        <textarea ref={textRef} autoFocus rows="1" onChange={(e) => {
                                if (state.textAreaInput[0] === "#") {
                                    setTextAreaMode("findPoint");
                                    textRef.current.value = "";
                                }
                                else {
                                    setText(e.target.value);
                                }
                            }}
                        ></textarea>
                        <button disabled={(state.textAreaInput.length === 0)}
                            onClick={handleSendText}>
                            send msg
                        </button>
                </TextContainer>
            )}

            {( textAreaMode === "findPoint" &&
                <TextContainer>
                    <Textarea ref={searchTermRef} autoFocus rows="1" defaultValue="#"
                    onChange={(e) => {
                        if (e.target.value.length === 1 && e.target.value[0] !== "#") {
                            searchTermRef.setSelectionRange(1, 1);
                            searchTermRef.focus();
                        }
                        setSearchTerm(e.target.value);
                        if (e.target.value[0] !== "#") {
                            setTextAreaMode("text");
                            setText("");
                        }
                    }}>
                    </Textarea>
                    <button 
                        onClick={handleFindPoint}>
                        find point
                    </button>
                </TextContainer>
            )}

            {( textAreaMode === "addPoint" &&
                <TextContainer>
                    <Textarea autoFocus rows="1" defaultValue={"#" + selectedMatch.title + " (" + selectedMatch.type + "), " + selectedMatch.year} 
                        onClick={onSomething} onChange={onChangeSuggestionMode}>
                    </Textarea>
                    <button 
                        onClick={handleAddPoint}>
                        add point
                    </button>
                </TextContainer>
            )}
            

  

        </Wrapper>
    )
}

const Wrapper = styled.div`
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

const Textarea = styled.textarea`
    color: orange;
`
export default Textbox;