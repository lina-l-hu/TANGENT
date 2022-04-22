//search for existing Users and Points

import styled from "styled-components";
import { useReducer, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import PageWrapper from "../components/GeneralPageComponents/PageWrapper"
import PointPreview from "./PointComponents/PointPreview";
import UserPreview from "../components/MyCircle/UserPreview";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

const initialState = {
    searchTerm: null, 
    searchResults: null,
    status: "idle", //searching, success, error
    error: null
}

const reducer = (state, action) => {
    switch (action.type) {

        case ("set-searchTerm") : {
            return {
                ...state, 
                searchTerm: action.searchTerm
            }
        }

        case ("search-initiated") : {
            return {
                ...state, 
                status: "searching",
            }
        }

        case ("search-success") : {
            return {
                ...state, 
                searchResults: action.searchResults,
                status: "success",
            }
        }   
        
        case ("search-failed") : {
            return {
                ...state, 
                status: "failed", 
                error: action.error
            }
        }   

        default : {
            return {
                ...state
            }
        }
    }
}

const Search = () => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const { state: {currentUser, currentUserStatus} } = useContext(CurrentUserContext);
    
    const handleSearch = (e) => {
        e.preventDefault();

        dispatch({
            type: "search-initiated"
        })

        fetch(`/search?searchTerm=${state.searchTerm}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {

            if (data.status === 200) {
                
                dispatch ({
                    type: "search-success", 
                    searchResults: data.data, 
                })
            }
            else {
                dispatch ({
                    type: "search-failed",
                    error: "We encountered an error during search -- please try again!"
                })
            }
        })
        .catch ((error) => {
            dispatch ({
                type: "search-failed",
                error: "We encountered an error during search -- please try again!"
            })
        })
    }

    return (
    <PageWrapper>
        <Body>
            <form onSubmit={handleSearch}>
                <input
                    type="text" 
                    placeholder="point title or user name"
                    onChange={(e) => { 
                        dispatch({
                            type: "set-searchTerm", 
                            searchTerm: e.target.value
                        })
                    }}
                />
                <button><FaSearch className="icon"/></button>
            </form>
            {(state.status === "success" && currentUserStatus === "idle") &&
                <Results>
                    {(state.searchResults.users.length > 0) && 
                        <Section>
                            <Title>users</Title>
                            <>
                            {state.searchResults.users.map((user) => {
                                return <UserPreview key={user._id}  _id={user._id} username={user.username} 
                                tagline={user.tagline} imgSrc={user.avatar}/>
                            })}
                            </>
                        </Section>
                    }
                    {(state.searchResults.points.length > 0) && 
                        <Section>
                            <Title>points</Title>
                            <>
                            {state.searchResults.points.map((point) => {
                                return <PointPreview key={point._id} _id={point._id} coverImgSrc={point.coverImgSrc} title={point.title} type={point.type} 
                                by={point.by} year={point.year} format="short" userPoints={currentUser.points}/>
                            })}
                            </>
                        </Section>
                    }
                </Results>
            }
        </Body>
        <Spacer></Spacer>
    </PageWrapper>
    )
}

const Spacer = styled.div`
    height: 70px;
`;

const Body = styled.div`
    overflow: scroll;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    form {
        margin: 50px;
        display: flex;
        align-items: center;
    }

    input {
        font-size: 20px;
        font-family: var(--font-body);
        border: none;
        border-radius: 15px;
        width: 220px;
        margin-right: 5px;
        padding: 3px 5px;
    }

    button {
        border-radius: 50%;

        &:hover {
            transform: scale(1.05);
        }
    }

    .icon { 
        font-size: 25px;
    }
`;

const Results = styled.div`
    width: 100%;
`;

const Title = styled.h3`
    margin: 0 30px;
    font-family: var(--font-heading);
    font-size: 26px;
    font-weight: bold;
    font-style: italic;
`;

const Section = styled.div`
    width: 100%;
    margin-bottom: 40px;
`;

export default Search;