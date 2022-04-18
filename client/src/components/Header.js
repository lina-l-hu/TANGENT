import styled from "styled-components";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import PageWrapper from "./PageWrapper";
import NavigationMenu from "./NavigationMenu";
import { FaArrowLeft } from "react-icons/fa";
import Avatar from "./Avatar";
import { CurrentUserContext } from "./Profile/CurrentUserContext";

const Header = ({children, titleSize}) => {

    const { currentUsername } = useContext(CurrentUserContext);
    
    const navigate = useNavigate();


    return (
        <Wrapper>
            <button onClick={() => navigate(-1)}>
                <FaArrowLeft className="icon"/>
            </button>
            <Title smaller={(titleSize === "smaller")}>{children}</Title>
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
    font-size: ${props => (props.smaller) ? "26px" : "33px"};
`;

const AddTangentLink = styled(NavLink)`
    /* padding-right: 20px; */

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