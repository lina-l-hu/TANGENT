import styled from "styled-components";
import Avatar from "../Avatar";
import { useAuth0 } from "@auth0/auth0-react";

const ProfileHeader = ({username, tagline}) => {

    const { user, isLoading } = useAuth0();
    console.log("user", user);

    //only render if not loading
    return (
        <Wrapper>
            {( !isLoading &&
            <>
            <Avatar format="large" />
            <img src={user.picture} />
            <h3>{user.name}</h3>
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