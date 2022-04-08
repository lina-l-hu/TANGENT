import styled from "styled-components";
import Avatar from "../Avatar";

const ProfileHeader = ({username, tagline}) => {
    return (
        <Wrapper>
            <Avatar format="large" />
            <h3>{username}Lily</h3>
            <p>{tagline}marmalade and fellini enthusiast</p>
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