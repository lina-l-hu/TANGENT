import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Avatar from "../GeneralPageComponents/Avatar";
import ToggleInCircleButton from "../Profile/ToggleInCircleButton";

const UserPreview = ({_id, imgSrc, username, tagline}) => {
    return (
        <Wrapper>
            <NavLink to={`/profile/${_id}`}>
                <AvatarDiv>
                    {(imgSrc) ? (
                    <Avatar avatarImgSrc={imgSrc} format="small"/>
                ) : (
                    <Avatar userLetter={username.charAt(0).toUpperCase()} format="small"/>
                )}
                </AvatarDiv>
                
                <Text>
                    <h3>{username}</h3>
                    <p>{tagline}</p>
                </Text>
            </NavLink>
            <ButtonDiv>
                <ToggleInCircleButton friendId={_id}/>
            </ButtonDiv>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 85%;
    margin: 20px auto;
    display: flex;
    align-items: center;

    a {
        display: flex;
        width: 70%;
    }
    `;

const AvatarDiv = styled.div`
    width: 20%;
`;

const ButtonDiv = styled.div`
    width: 30%;
`;

const Text = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    * {
        margin: 3px 0;
    }

    p {
        font-style: italic
    }
`;
export default UserPreview;