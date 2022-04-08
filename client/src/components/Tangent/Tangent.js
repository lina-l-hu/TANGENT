import styled from "styled-components";
import { NavLink } from "react-router-dom";
import PageWrapper from "../PageWrapper";
import Textbox from "./Textbox";
import Message from "./Message";
import Header from "../Header";
import PointPreview from "../PointPreview";

const Tangent = () => {
    return (
        <PageWrapper>
            {/* <Header>tangent</Header> */}
            <AllPointsLink to="/points">all Points mentioned</AllPointsLink>
            <Messages>
                <Message />
                <PointPreview />
            </Messages>
            <Textbox />
        </PageWrapper>
    )
}

const AllPointsLink = styled(NavLink)`
    margin: 0 auto;
    margin-top: 15px;
    padding: 5px 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: var(--color-main);
    border-radius: 20px;
`;

const Messages = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export default Tangent;