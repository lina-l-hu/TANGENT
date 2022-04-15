import styled from "styled-components";
import PageWrapper from "./PageWrapper";
import LoginButton from "./Login";
import { useAuth0 } from "@auth0/auth0-react";

const LandingPage = () => {

    const AuthNav = () => {
        const {isAuthenticated} = useAuth0();
    }
    
    return <Wrapper>
        <LoginButton />
        
    </Wrapper>
}

const Wrapper = styled(PageWrapper)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
export default LandingPage;