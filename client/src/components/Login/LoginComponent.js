import styled from "styled-components";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { CurrentUserContext } from "../Profile/CurrentUserContext";

//Login component that gets a token from the server for authentication

async function loginUser(credentials) {
    return fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }

export default function LoginComponent ({setSignupMode}) {
    const navigate = useNavigate();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);

    const { token, actions: {setToken, setSignedInEmail} } = useContext(CurrentUserContext);

    const handleClick = () => {
        setSignupMode(true);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignedInEmail(email);
        
        //some validation 
        if (password === "" || !password || 
        email.indexOf("@") < 1 || email.indexOf("@") > (email.length - 2) || 
        email.length < 3 || !email || email === "") {
            setError("You must enter a valid email and password with more than 3 characters each.")
        }
        else {
            
            const noCaseEmail = email.toLowerCase();
            const token = await loginUser({ email: noCaseEmail, password: password});
            console.log("token", token);
            if (token.status) {
                setError(token.message);
            }
            else {
                setToken(token);
                navigate("/feed");   
            }
        }
        

    }

    return (
        <Wrapper>
            <p>please log in</p>
            <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="email"   
              onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
            />
            <input
              type="password"
              placeholder="password"   
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
            />
            <button>enter</button>
            </form>
            <button className="link" onClick={handleClick}>or signup here</button>
            <ErrorMsg><p>{error}</p></ErrorMsg>
        </Wrapper>
    )
}

LoginComponent.propTypes = {
    setToken: PropTypes.func.isRequired
}

const Wrapper = styled.div`
    background-color: var(--color-secondary-transparent);
    padding: 25px;
    width: 60%;

    form {
        display: flex;
        flex-direction: column;
    }

    * {
        margin: 5px 0;
    }

    input {
        font-family: var(--font-body);
    }

    .link {
        background-color: transparent;
    }
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