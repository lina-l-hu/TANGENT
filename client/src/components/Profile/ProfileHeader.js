import styled from "styled-components";
import { useContext } from "react";
import { CurrentUserContext } from "./CurrentUserContext";
import Avatar from "../Avatar";
import { useAuth0 } from "@auth0/auth0-react";

const ProfileHeader = ({isCurrentUser, username, status, avatarImgSrc, tagline}) => {

    const { user, isLoading } = useAuth0;
    console.log("user in header", user)

    const { state: { authProfile }} = useContext(CurrentUserContext);

    //only render if not loading
    return (
        <Wrapper>
            {( status === "idle" && !isLoading && 
            <>
            <Avatar avatarImgSrc={(isCurrentUser) ? authProfile.picture : avatarImgSrc} userLetter={username.charAt(0).toUpperCase()} format="large" />
            <h3>{username}</h3>
            <p>{tagline}</p>
            </>
            )}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;

    p {
        font-style: italic;
    }

    * {
        margin: 7px 0;
    }
`;

export default ProfileHeader;