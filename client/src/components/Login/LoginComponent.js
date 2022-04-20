import styled from "styled-components";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const LoginComponent = ({setSignupMode}) => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleClick = () => {
        setSignupMode(true);
    }

    return (
        <Wrapper>
            <p>please log in</p>
            <form>
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
            <button>join our circle</button>
            </form>
            {/* <StyledLink to="/signup">or signup here</StyledLink> */}
            <button className="link" onClick={handleClick}>or signup here</button>
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

export default LoginComponent;