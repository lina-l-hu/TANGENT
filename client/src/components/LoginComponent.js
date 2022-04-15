import styled from "styled-components";
import { useState } from "react";

const LoginComponent = () => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <Wrapper>
            <h1>tangent</h1>
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
            <button>enter</button>
            </form>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: 0 auto;
    margin-top: 300px;

    form {
        display: flex;
        flex-direction: column;
    }
`;

export default LoginComponent;