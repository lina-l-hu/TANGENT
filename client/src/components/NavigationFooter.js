import styled from "styled-components";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaRegComment, FaRegUserCircle, FaSearch, FaRegNewspaper, FaUserFriends } from "react-icons/fa";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

const NavigationFooter = () => {

    const { state: {currentUser} } = useContext(CurrentUserContext);
    return (
        <Wrapper>
            <NavLink to="/feed">
                <FaRegNewspaper className="icon"/>
            </NavLink>

            <NavLink to="/my-circle">
                <FaUserFriends className="icon"/>
            </NavLink>
            
            <NavLink to="/tangents">
                <FaRegComment className="icon"/> 
            </NavLink>
           
            <NavLink to="/search">
                <FaSearch className="icon"/>
            </NavLink>
            
            <NavLink to={`/profile/${currentUser._id}`}>
                <FaRegUserCircle className="icon"/>
            </NavLink>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: absolute;
    border-radius: 0px;
    bottom: 0;
    width: 100%;
    height: 69.33px;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    .icon {
        font-size: 30px;
        color: var(--color-secondary);

        &:hover {
            color: var(--color-main);
        }
    }
`;

export default NavigationFooter;