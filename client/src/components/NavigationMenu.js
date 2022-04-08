import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FaEquals } from "react-icons/fa";

//The Navigation is modal dropdown
const NavigationMenu = () => {
    return (
        <Wrapper>
            <MenuIcon>
                <FaEquals className="icon" color="white"/>
            </MenuIcon>
            <NavContent>
                <li>feed</li>
                <li>my profile</li>
                <li>my circle</li>
                <li>search</li>
                <li>sign out</li>
            </NavContent>

        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    width: 300px;

    li {
        font-family: "Advent Pro";
        font-size: 30px;
        color: white;
        letter-spacing: 2px;
        line-height: 40px;
    }
`;

const MenuIcon = styled.button`
    padding-left: 20px;
    background-color: transparent;

    .icon {
        font-size: 26px;
        /* border: 1px solid red; */
        padding: 25px 0;
    }
`;

const NavContent = styled.ul`
    position: absolute;
    background-color: var(--color-secondary);
    display: none;
    /* display: inline-block; */
    top: 78px;
    left: 0;
    padding: 10px 20px 20px 20px;
    

    /* &:hover {
        display: inline-block;
    } */
`;

export default NavigationMenu;