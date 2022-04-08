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
            <ProfileLink to="/profile">
                {/* <FaRegUser className="icon" color="white"/> */}
                <Avatar userLetter="L" />
            </ProfileLink>
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

const ProfileLink = styled(NavLink)`
    padding-right: 20px;

    .icon {
        font-size: 30px;
    }
`;

export default Header; 