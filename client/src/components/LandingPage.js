import styled from "styled-components";
import { useState } from "react";
import PageWrapper from "./GeneralPageComponents/PageWrapper"
import LoginComponent from "./Login/LoginComponent";
import SignupComponent from "./Login/SignupComponent";

//Landing page with a toggle for the Sign In or Signup components
const LandingPage = () => {

    const [ signupMode, setSignupMode ] = useState(false);
    
    return (
    <PageWrapper>
        <Body>
            <Logo>tangent</Logo>
            {(!signupMode) ? (
                <LoginComponent  setSignupMode={setSignupMode}/>
            ) : (
                <SignupComponent  setSignupMode={setSignupMode}/>
            )}
        </Body>
        
    </PageWrapper>
    )
}

const Body = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Logo = styled.h1`
    margin: 180px 0 40px 0;
    font-size: 50px;
`;

export default LandingPage;