import styled from "styled-components";
import { useState, useReducer } from "react";
import { NavLink } from "react-router-dom";

const initialState = {
    username: null, 
    name: null, 
    email: null, 
    avatar: null, 
    tagline: null, 
    postToServerStatus: "idle", //sending, success, fail
    error: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case ("set-name"): {
            return {
                ...state, 
                name: action.name,
            }
        }

        case ("set-username"): {
            return {
                ...state, 
                username: action.username,
            }
        }

        case ("set-email"): {
            return {
                ...state, 
                email: action.email,
            }
        }

        case ("set-password"): {
            return {
                ...state, 
                password: action.password,
            }
        }

        case ("set-tagline"): {
            return {
                ...state, 
                tagline: action.tagline,
            }
        }

        case ("set-image"): {
            return {
                ...state, 
                image: action.image,
            }
        }

        case ("posting-to-server"): {
            return {
                ...state,
                postToServerStatus: "sending"
            }
        }

        case ("user-created"): {
            return {
                ...state,
                postToServerStatus: "success"
            }
        }

        case ("failed-post"): {
            return {
                ...state,
                postToServerStatus: "failed",
                error: action.error
            }
        }

    }
}

const SignupComponent = ({setSignupMode}) => {

    const [ state, dispatch ] = useReducer(reducer, initialState);

    const handleClick = () => {
        setSignupMode(false);
    }

    const handleSubmit = () => {

    }


    return (
        <Wrapper>
            <p>sign up</p>
            <form onSubmit={handleSubmit}>
                    <input
                    type="text" 
                    placeholder="name"
                    onChange={(e) => dispatch ({
                        type: "set-name", 
                        name: e.target.value
                    }) }
                    />

                    <input
                    type="text" 
                    placeholder="username"
                    onChange={(e) => dispatch ({
                        type: "set-username", 
                        username: e.target.value
                    }) }
                    />
 
                    <input
                    type="text" 
                    placeholder="email"
                    onChange={(e) => dispatch ({
                        type: "set-email", 
                        email: e.target.value
                    }) }
                    />

                    <input
                    type="password" 
                    placeholder="password"
                    onChange={(e) => dispatch ({
                        type: "set-password", 
                        password: e.target.value
                    }) }
                    />
              
                    <input
                    type="text" 
                    placeholder="your tagline -- e.g. new wave over old wave"
                    onChange={(e) => dispatch ({
                        type: "set-tagline", 
                        tagline: e.target.value
                    }) }
                    />

                <label>upload profile picture 
                    <input className="file-input"
                    type="file" 
                    onChange={(e) => dispatch ({
                        type: "set-image", 
                        image: e.target.files[0]
                    }) }
                    />
                </label>
            <button>connect</button>
            </form>
            <button className="link" onClick={handleClick}>already in our circle? sign in</button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* margin: 0 auto;
    margin-top: 300px; */
    background-color: var(--color-secondary-transparent);
    padding: 25px;
    width: 60%;

    form {
        display: flex;
        flex-direction: column;
    }
    
    label {
        font-family: var(--font-heading);
        font-size: 14px;
        color: white;
    }

    input {
        font-family: var(--font-body);
    }

    * {
        margin: 5px 0;
    }

    .link {
        background-color: transparent;
    }
    
`;

const StyledLink = styled(NavLink)`
    font-family: var(--font-body);
    text-align: right;
    margin-top: 20px;
    font-size: 14px;
    
`;

export default SignupComponent;