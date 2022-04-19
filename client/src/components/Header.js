import styled from "styled-components";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import PageWrapper from "./PageWrapper";
import NavigationMenu from "./NavigationMenu";
import { FaArrowLeft } from "react-icons/fa";
import Avatar from "./Avatar";
import { CurrentUserContext } from "./Profile/CurrentUserContext";
import { GlobalContext } from "./GlobalContext";

const Header = ({children, titleSize}) => {

    const { currentUsername } = useContext(CurrentUserContext);
    const { showNewTangentModal, setShowNewTangentModal } = useContext(GlobalContext);
    const navigate = useNavigate();
    console.log("show maodal", showNewTangentModal);
    
    if (window.location.pathname.includes('/tangent/')) {
        children = "tangent";
    }
    else if (window.location.pathname.includes('/tangents/')) {
        children = "my tangents";
    }
    else if (window.location.pathname.includes('/points/')) {
        children = "point";
    }
    else if (window.location.pathname.includes('/profile/')) {
        children = "profile";
    }
    else if (window.location.pathname.includes('/my-circle')) {
        children = "my circle"
    }
    else if (window.location.pathname.includes('/points')) {
        children = "points in tangent"
    }
    else {
        children = window.location.pathname.slice(1);
    }

    const handleClick = () => {
        setShowNewTangentModal(true);
    }

    return (
        <Wrapper>
            <button onClick={() => navigate(-1)}>
                <FaArrowLeft className="icon"/>
            </button>
            <Title smaller={(titleSize === "smaller")}>{children}</Title>
            <AddTangentDiv><button onClick={handleClick}>+</button></AddTangentDiv>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    position: relative;
    min-height: 76px;
    background-color: var(--color-secondary);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    button {
        background-color: transparent;
    }

    .icon {
        font-size: 30px;
    }
`;

const Title = styled.h1`
    width: 200px;
    text-align: center;
    left: 95px;
    position: absolute;
    color: white;
    font-size: ${props => (props.smaller) ? "26px" : "30px"};
`;

const AddTangentDiv = styled.div`
    /* padding-right: 20px; */

    button {
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