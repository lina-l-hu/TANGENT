import styled from "styled-components";
import { useRef, useContext } from "react";

//A dropup that shows suggestions during Point search
const PointSuggestionDropup = ({suggestedMatches, selectedMatch, setSelectedMatch, 
    displaySuggestionsDropup, setDisplaySuggestionsDropup, setMode, mode}) => {
    
    const nodeRef = useRef();
    const handleSelect = (event) => {

        //identify which element has been clicked
        const targettedClass = event.target.className; 
        //depending on where the click happened in the div, the className returned may include the class of the 
        //sub-element too, so we need to extract just the id className we assigned
        const classnameArray = targettedClass.split(" ");
        const selectedId = classnameArray[classnameArray.length-1];

        let selectedObject = undefined;

        // if selected title is a film
        if (selectedId.charAt(0) === "t") {
            if (suggestedMatches.filmPoints.length > 0) {
                selectedObject = suggestedMatches.filmPoints.find((match) => match._id === selectedId);
            }
            
            if (suggestedMatches.films.length > 0 && selectedObject === undefined) {
                selectedObject = suggestedMatches.films.find((match) => match._id === selectedId);
            }
        }
        else {
            if (suggestedMatches.bookPoints.length > 0) {
                selectedObject = suggestedMatches.bookPoints.find((match) => match._id === selectedId);
            }

            if (suggestedMatches.books.length > 0 && selectedObject === undefined) {
                selectedObject = suggestedMatches.books.find((match) => match._id === selectedId);
            }
        }

        //set the selected element to state
        setSelectedMatch(selectedObject);
        
        //turn on suggestion mode
        setMode("suggestion")
        // searchTermRef.value = "#" + selectedMatch.title + " (" + selectedMatch.type + "), " + selectedMatch.year;
    }

    // window.onclick = function(event) {
    //     if (nodeRef.current && !nodeRef.current.contains(event.target)) {
    //         setDisplaySuggestionsDropup(false);
    //     }
    // }

    return (
        <Wrapper ref={nodeRef} isDisplay={(displaySuggestionsDropup)}>
        {/* <Wrapper ref={nodeRef}> */}
            <Content>
                <>
                {(suggestedMatches.filmPoints.length > 0 && 
                    <>
                    {suggestedMatches.filmPoints.map((film) => {
                        const type = "type ";
                        return <div key={film._id} className={film._id} onClick={handleSelect}>
                            <Title className={film._id}>{film.title}</Title>
                            <span className={film._id}> ({film.year}) </span>
                            <By className={film._id}>- {film.by}</By>
                            <Type className={type + film._id}>film</Type>
                            <Type className={type + film._id}>point</Type>
                        </div>
                    })
                    }   
                    </>
                )}
                </>

                <>
                {(suggestedMatches.films.length > 0 && 
                    <>
                    {suggestedMatches.films.map((film) => {
                        const type = "type ";
                        return <div key={film._id} className={film._id} onClick={handleSelect}>
                            <Title className={film._id}>{film.title}</Title>
                            <span className={film._id}> ({film.year}) </span>
                            <By className={film._id}>- {film.by}</By>
                            <Type className={type + film._id}>film</Type>
                        </div>
                    })
                    }   
                    </>
                )}
                </>

                <>
                {(suggestedMatches.bookPoints.length > 0 && 
                    <>
                    {suggestedMatches.bookPoints.map((book) => {
                        const type = "type ";
                        return <div key={book._id} className={book._id} onClick={handleSelect}>
                            <Title className={book._id}>{book.title}</Title>
                            <span className={book._id}> ({book.year}) </span>
                            <By className={book._id}>- {book.by}</By>
                            <Type className={type + book._id}>book</Type>
                            <Type className={type + book._id}>point</Type>
                        </div>
                    })
                    }   
                    </>
                )}
                </>

                <>
                {(suggestedMatches.books.length > 0 && 
                    <>
                    {suggestedMatches.books.map((book) => {
                        const type = "type ";
                        return <div key={book._id} className={book._id} onClick={handleSelect}>
                        <Title className={book._id}>{book.title}</Title>
                            <span className={book._id}> ({book.year}) </span>
                            <By className={book._id}>- {book.by}</By>
                            <Type className={type + book._id}>book</Type>
                        </div>
                    })
                    }   
                    </>
                )}
                </>
            </Content>
        </Wrapper>
    )
}

const Wrapper = styled.div`

    display: ${props => (props.isDisplay ? 'block' : 'none')};
    overflow: auto;

    z-index: 5;
    background-color: white;
    width: 68%;
    /* position: fixed; */
    position: absolute;
    bottom: 58px;
    left: 11px;
    padding: 3px;
    `;

const Content = styled.div`
    div {
        /* border: 1px solid var(--color-main); */
        /* border-radius: 0px; */
        padding: 7px;
        line-height: 1.3;

        &:hover {
            background-color: var(--color-secondary);
            
            span {
                color: white;
            }

            /* .type {
                border: 1px solid white;
            } */
        }
    }

    span {
        color: var(--color-main);
    }
`;

const Title = styled.span`
    font-weight: bold;
    /* font-family: var(--font-subheading); */
`;

const By = styled.span`
    font-style: italic;
`;

const Type = styled.span`
    margin-left: 10px;
    padding: 1px 3px;
    /* background-color: var(--color-secondary); */
    border: 1px solid var(--color-main);
    color: white;
    border-radius: 5px;
    font-size: 12px;

`;
export default PointSuggestionDropup;