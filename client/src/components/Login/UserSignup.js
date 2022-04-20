import styled from "styled-components";
import PageWrapper from "../GeneralPageComponents/PageWrapper";
import SignupComponent from "./SignupComponent";

const UserSignup = () => {

    return (
        <PageWrapper>
            <Body>
            <Logo>tangent</Logo>
            <SignupComponent />
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


export default UserSignup;