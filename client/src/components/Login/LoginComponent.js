import styled from "styled-components";
import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { CurrentUserContext } from "../Profile/CurrentUserContext";

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
        
        if (password === "" || !password || 
        email.indexOf("@") < 1 || email.indexOf("@") > (email.length - 2) || 
        email.length < 3 || !email || email === "") {
            setError("You must enter a valid email and password with more than 3 characters each.")
        }
        else {
            
            const token = await loginUser({ email, password});
            if (token.status) {
                console.log("not authenticated");
                setError(token.message);
            }
            else {
                setToken(token);
                navigate("/feed");   
            }
            console.log("toke", token)
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
            {/* <StyledLink to="/signup">or signup here</StyledLink> */}
            <button className="link" onClick={handleClick}>or signup here</button>
            <ErrorMsg><p>{error}</p></ErrorMsg>
        </Wrapper>
    )
}

LoginComponent.propTypes = {
    setToken: PropTypes.func.isRequired
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

// const StyledLink = styled(NavLink)`
//     font-family: var(--font-body);
//     text-align: right;
//     margin-top: 20px;
//     font-size: 14px;
    
// `;