//signup form component

import styled from "styled-components";
import { useReducer, useState } from "react";

const initialState = {
    username: null, 
    name: null, 
    email: null, 
    avatar: null, 
    tagline: null, 
    postToServerStatus: "idle", //other statuses: sending, success, fail
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

        case ("form-error") : {
            return {
                ...state, 
                error: action.error
            }
        }

        case ("reset-error") : {
            return {
                ...state, 
                error: null
            }
        }

        default : {
            return {
                ...state
            }
        }

    }
}

const SignupComponent = ({setSignupMode}) => {

    const [ state, dispatch ] = useReducer(reducer, initialState);
    const [ localImage, setLocalImage ] = useState(null);

    const handleClick = () => {
        setSignupMode(false);
    }
    
    //will implement adding profile images soon
    // const uploadImage = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("file", localImage);
    //     formData.append("upload_preset", "TangentProfileImages");

    //     fetch("https://api.cloudinary.com/v1_1/lina777/image/upload", {
    //     method: "POST",
    //     body: formData
    //     })
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log("data", data)
    //         console.log("data.url", data.url)
    //         dispatch({
    //             type: "set-image",
    //             image: data.url
    //         })
    //         return 
    //     });
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state.username.length < 1 || state.name.length < 1 || !state.username || !state.name 
            || state.password.length < 1 || !state.password) {
            dispatch({
                type: "form-error",
                error: "Name, username, and password are required and must have at least one character."
            })
            return;
        }

        if (state.email.indexOf("@") < 1 || state.email.indexOf("@") > (state.email.length - 2) || 
        state.email.length < 3 || !state.email || state.email === "") {
            dispatch({
                type: "form-error",
                error: "Invalid email."
            })
            return;
        }

        const newUser = {
            username: state.username,
            name: state.name, 
            email: state.email, 
            avatar: state.avatar, 
            tagline: state.tagline, 
            password: state.password
        }


        console.log ("new User before fetch", newUser);

        fetch("/users/add-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Accept': 'application/json',
            },
            body: JSON.stringify(newUser)
            
            })
            .then(res => res.json())
            .then(data => {

                if (data.status === 200) {
                    dispatch ({
                        type: "user-created"
                    })
                    dispatch({
                        type: "form-error",
                        error: "You are all signed up! Please sign in with the above link!"
                    })

                }
                else {
                        dispatch({
                            type: "failed-post",
                            error: data.message
                        })
                }
            })
            .catch((err) => {
                dispatch({
                    type: "failed-post",
                    error: "Error during post to server -- please try again."
                })
               
            })
    }

    return (
        <Wrapper>
            <p>sign up</p>
            <form onSubmit={handleSubmit}>
                    <input
                    type="text" 
                    placeholder="name"
                    onChange={(e) => { dispatch ({
                        type: "set-name", 
                        name: e.target.value
                    }) 
                        dispatch ({
                            type: "reset-error"
                        })
                    }}
                    />

                    <input
                    type="text" 
                    placeholder="username"
                    onChange={(e) => { dispatch ({
                        type: "set-username", 
                        username: e.target.value
                    }) 
                    dispatch ({
                        type: "reset-error"
                    })
                }}
                    />
 
                    <input
                    type="text" 
                    placeholder="email"
                    onChange={(e) => { dispatch ({
                        type: "set-email", 
                        email: e.target.value
                    }) 
                    dispatch ({
                        type: "reset-error"
                    })
                }}
                    />

                    <input
                    type="password" 
                    placeholder="password"
                    onChange={(e) => { dispatch ({
                        type: "set-password", 
                        password: e.target.value
                    }) 
                    dispatch ({
                        type: "reset-error"
                    })
                }}
                    />
              
                    <input
                    type="text" 
                    placeholder="your tagline -- e.g. new wave over old wave"
                    onChange={(e) => { dispatch ({
                        type: "set-tagline", 
                        tagline: e.target.value
                    }) 
                    dispatch ({
                        type: "reset-error"
                    })
                }}
                    />

                {/* <label>upload profile picture 
                    <input className="file-input"
                    type="file" 
                    onChange={(e) => { 
                        setLocalImage(e.target.files[0])
                        dispatch ({
                            type: "reset-error"
                        })
                }}
                    />
                <PhotoUpload onClick={uploadImage}>upload photo</PhotoUpload>
                </label> */}
            <button >connect</button>
            </form>
            <button className="link" onClick={handleClick}>already in our circle? sign in</button>
            <ErrorMsg><p>{state.error}</p></ErrorMsg>
        </Wrapper>
    )
}

const Wrapper = styled.div`
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

const PhotoUpload = styled.button`
`;

const ErrorMsg = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    height: 30px;

    p {
        font-size: 12px;
        font-style: italic;
    }

`

export default SignupComponent;