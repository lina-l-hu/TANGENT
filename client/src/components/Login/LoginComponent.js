import styled from "styled-components";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

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

export default function LoginComponent ({setToken, setSignupMode}) {
    const navigate = useNavigate();

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleClick = () => {
        setSignupMode(true);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = await loginUser({
          email,
          password
        });
        console.log("toke", token)
        setToken(token);
        navigate("/feed");

    }

    return (
        <Wrapper>
            <p>please log in</p>
            <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="email"   
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"   
              onChange={(e) => setPassword(e.target.value)}
            />
            <button>enter</button>
            </form>
            {/* <StyledLink to="/signup">or signup here</StyledLink> */}
            <button className="link" onClick={handleClick}>or signup here</button>
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

// const StyledLink = styled(NavLink)`
//     font-family: var(--font-body);
//     text-align: right;
//     margin-top: 20px;
//     font-size: 14px;
    
// `;