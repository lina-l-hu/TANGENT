import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
// import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "../components/Profile/CurrentUserContext";

//should we fetch for username and imgSrc here or be passed?!!! 
//name not used for profile previews, but used for feed and point pages

const TangentPreview = ({tangentId, text, username, imgSrc, timestamp}) => {
    
    // const { user, isLoading } = useAuth0();

    //make a class for these and point previews so that they animate on click
    
    let userLetter = "";
    // if (!imgSrc) {
    //     userLetter = username.charAt(0);
    // }

    return (
        <Wrapper>
            <Stamp>{(username) ? `${username} • ${timestamp}` : timestamp}</Stamp>
            <Content to={`/tangents/${tangentId}`}>
                <Avatar format="small" avatarImgSrc={imgSrc} userLetter={userLetter} />
                <div>
                    <p>{text}</p>
                </div>
            </Content>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin: 20px 0;
`;

const Content = styled(NavLink)`
    display: flex;
    width: 85%;
    margin: 0 auto;
    border: 4px solid white;
    background-color: rgba(255, 255, 255, 0.5);
    color: white;
    padding: 10px;
    border-radius: 15px;

    div {
        * {
            line-height: 26px;
            margin-left: 10px;
        }
    }
`;

const Stamp = styled.div`
    width: 85%;
    margin: 0 auto;
    margin-bottom: 5px;
    text-align: right;
    font-family: var(--font-subheading);
    font-size: 12px;
    font-style: italic;
`;
export default TangentPreview;