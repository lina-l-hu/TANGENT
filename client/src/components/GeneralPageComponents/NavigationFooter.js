import styled from "styled-components";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaRegComment, FaRegUserCircle, FaSearch, FaRegNewspaper, FaUserFriends } from "react-icons/fa";
import { CurrentUserContext } from "../Profile/CurrentUserContext";

//footer with navigation links
const NavigationFooter = () => {

    const { state: {currentUser, currentUserStatus} } = useContext(CurrentUserContext);
    return (
        <Wrapper>
            <NavLink to="/feed">
                <FaRegNewspaper 
                className={(window.location.pathname=== "/feed") ? "icon selected" : "icon"}/>
            </NavLink>

            <NavLink to="/my-circle">
                <FaUserFriends 
                className={(window.location.pathname === "/my-circle") ? "icon selected" : "icon"}/>
            </NavLink>
            
            <NavLink to="/tangents">
                <FaRegComment className={(window.location.pathname === "/tangents") ? "icon selected" : "icon"}/>
            </NavLink>
           
            {/* <NavLink to="/search">
                <FaSearch className={(window.location.pathname === "/search") ? "icon selected" : "icon"}/>
            </NavLink> */}

            {(currentUserStatus === "idle") ? (
                <NavLink to={`/profile/${currentUser._id}`}>
                    <FaRegUserCircle className="icon"/>
                </NavLink>
            ) : (
                <FaRegUserCircle className="icon"/>
            )}
            
            
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
            color: #7A729F;
        }
    }

    .selected { 
        color: #7A729F;
    }

`;

export default NavigationFooter;