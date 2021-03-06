//Message component used on Tangent chat
import styled from "styled-components";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "../GeneralPageComponents/Avatar";
import { CurrentUserContext } from "../Profile/CurrentUserContext";

const Message = ({text, userId, username, avatarImgSrc, timestamp}) => {

    const { state: { currentUser, currentUserStatus } } = useContext(CurrentUserContext);
    
    if (currentUserStatus === "loading") {
        return <Wrapper></Wrapper>;
    }

    //different styling depending on if the message is from the signed-in user 

    if (currentUser.username === username) {
        return (
            <Wrapper>
                <Stamp thisUser={true}>{timestamp}</Stamp>

                <Content thisUser={true}>
                    <Text thisUser={true}>{text}</Text>
                    <div>
                        {(avatarImgSrc) ? ( 
                                <NavLink to={`/profile/${userId}`}>
                                <Avatar format="small" avatarImgSrc={avatarImgSrc} />
                                </NavLink>
                            ) : (
                                <NavLink to={`/profile/${userId}`}>
                                <Avatar format="small" userLetter={username.charAt(0).toUpperCase()} />
                                </NavLink>
                            )}
                    </div>
                </Content>   
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            {(username) ? (
                 <Stamp thisUser={false}>{username} • {timestamp}</Stamp>
            ) : (
                <Stamp thisUser={false}>{timestamp}</Stamp>
            )}
            <Content thisUser={false}>
                <div>
                    {(avatarImgSrc) ? ( 
                        <NavLink to={`/profile/${userId}`}>
                            <Avatar format="small" avatarImgSrc={avatarImgSrc} />
                            </NavLink>
                        ) : (
                            <NavLink to={`/profile/${userId}`}>
                            <Avatar format="small" userLetter={username.charAt(0).toUpperCase()} />
                            </NavLink>
                        )}
                </div>
            <Text thisUser={false}>{text}</Text>
            </Content>   
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 85%;
    margin: 5px 0;
`;

const Content = styled.div`
    width: 100%;
    display: flex;
    justify-content: ${props => (props.thisUser) ? "flex-end" : "flex-start"};

    div {
        margin-top: 3px;
    }

`;

const Stamp = styled.div`
    width: 100%;
    padding: ${props => (props.thisUser) ? "0 55px 3px 0" : "0 0 3px 55px"};
    margin-bottom: 5px;
    text-align: ${props => (props.thisUser) ? "right" : "left"};
    font-family: var(--font-subheading);
    font-size: 12px;
    font-style: italic;
    color: white;
`;

const Text = styled.p`
    border: ${props => (props.thisUser) ? "1px solid rgba(255,255,255,0.5)": "1px solid white"};
    border-radius: 15px;
    margin: ${props => (props.thisUser) ? "0 10px 0 0" : "0 0 0 10px"};
    max-width: 275px;
    overflow: auto;
    padding: 10px;
    text-align: ${props => (props.thisUser) ? "right" : "left"};
    background-color: ${props => (props.thisUser) ? "rgba(255,255,255,0.5)" : "transparent"};
    color: ${props => (props.thisUser) ? "gray" : "white"};
`

export default Message;