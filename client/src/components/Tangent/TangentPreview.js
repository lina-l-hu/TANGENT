import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Avatar from "../GeneralPageComponents/Avatar";
// import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import { useContext } from "react";

//should we fetch for username and imgSrc here or be passed?!!! 
//name not used for profile previews, but used for feed and point pages

const TangentPreview = ({tangentId, text, username, imgSrc, timestamp}) => {
    
    // const { user, isLoading } = useAuth0();

    //make a class for these and point previews so that they animate on click
    
    const { state: {currentUser} } = useContext(CurrentUserContext);

    console.log("imgsrc", imgSrc, username);

    return (
        <Wrapper>
            <Stamp>{(username) ? `${(currentUser.username === username) ? "me" : username} • ${timestamp}` : timestamp}</Stamp>
            <Content to={`/tangent/${tangentId}`}>
                <div>
                    {(imgSrc) ? ( 
                        <Avatar format="small" avatarImgSrc={imgSrc} />
                    ) : (
                        <Avatar format="small" userLetter={username.charAt(0).toUpperCase()} />
                    )}
                </div>

                <TextDiv>
                    <p>{text}</p>
                </TextDiv>
            </Content>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* margin: 20px 0; */
`;

const Content = styled(NavLink)`
    display: flex;
    width: 85%;
    margin: 0 auto;
    border: 4px solid rgba(255, 255, 255, 0.6);
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    padding: 10px;
    border-radius: 15px;
`;

const TextDiv = styled.div`
    line-height: 26px;
    margin-left: 10px;
`;

const Stamp = styled.div`
    width: 85%;
    margin: 0 auto;
    margin-top: 10px;
    margin-bottom: 5px;
    text-align: right;
    font-family: var(--font-subheading);
    font-size: 12px;
    font-style: italic;
    color: white;
`;
export default TangentPreview;