import styled from "styled-components";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUserContext } from "./CurrentUserContext";
import Avatar from "../GeneralPageComponents/Avatar";

const ProfileHeader = ({isCurrentUser, username, status, avatarImgSrc, tagline}) => {

    const navigate = useNavigate();

    const { state: { currentUser, currentUserStatus}, 
    actions: {setToken, setSignedInUID }} = useContext(CurrentUserContext);

    const handleSignout = () => {
        //clear the user token and the saved user id from local storage
        setToken(null);
        setSignedInUID(null);

        //redirect the user back to the landing login page
        navigate("/");
    }

    //only render if not loading
    return (
        <Wrapper>
            {( currentUserStatus === "idle" && 
            <>
            {(isCurrentUser && 
            <SignoutDiv>
                <button onClick={handleSignout}>sign out</button>
            </SignoutDiv>
            )}
            <Avatar avatarImgSrc={avatarImgSrc} userLetter={username.charAt(0).toUpperCase()} format="large" />
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

const SignoutDiv = styled.button`
    position: absolute;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    background-color: transparent;
    
    button {
        background-color: var(--color-secondary-transparent);
        padding: 10px;
        margin-right: 20px;
        margin-top: 0;
    }
`;

export default ProfileHeader;