import styled from "styled-components";
import { useRef, useState } from "react";
import Profile from "./Profile";

//Tabs on Profile Header
const ProfileTabs = ({tab, setTab}) => {

    const handleTabClick = (e) => {
        const className = e.target.className;
        setTab(className);
    }

    return (
        <Wrapper>
            <Tab className={(tab === "tangents") ? "active" : ""}>
                <button className="tangents" onClick={handleTabClick} >Tangents</button>
            </Tab>
            <Tab className={(tab === "points") ? "active" : ""}>
                <button className="points" onClick={handleTabClick} active={(tab === "tangents")}>Points</button>
            </Tab>
        </Wrapper>
    )

}

const Wrapper = styled.div`
    display: flex;
    margin: 0 auto;
    margin-bottom: 10px;
    width: 85%;
`;

const Tab = styled.div`
    width: 50%;
    border-radius: 0;
    border-bottom: 1px solid white;
    
    button {
        width: 100%;
        display: block;
        margin: 0 auto;
        padding-bottom: 5px;
        text-decoration: none;
        background: transparent;
        font-family: var(--font-heading);
        font-size: 20px;
        font-weight: 600;
        text-align: center;  
    }

    &:hover {
        color: var(--color-secondary);
        cursor: pointer;
    }
    
    .active {
        border-bottom: 4px solid white
    } 

`;

export default ProfileTabs;