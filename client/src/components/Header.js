import styled from "styled-components";
import { useParams, NavLink } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import NavigationMenu from "./NavigationMenu";
import { FaRegUser } from "react-icons/fa";
import Avatar from "./Avatar";

const Header = ({children}) => {

    const pathname = window.location.pathname.slice(1).replace("-", " ");

        //in profile, if profile is current user's, display header as me

    return (
        <Wrapper>
            <NavigationMenu />
            <Title>{pathname}</Title>
            <AddTangentLink to=""><div>+</div></AddTangentLink>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    height: 9%;
    background-color: var(--color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h1`
    width: 200px;
    text-align: center;
    left: 95px;
    position: absolute;

    color: white;
`;

const AddTangentLink = styled(NavLink)`
    padding-right: 20px;

    div {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-main);
        background-color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 40px;
        font-style: bold;
        font-family: var(--font-heading);
    }
   

`;

export default Header; 