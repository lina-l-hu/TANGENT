import styled from "styled-components";
import Avatar from "../Avatar";

const UserPreview = ({username, tagline}) => {
    return (
        <Wrapper>
            <Avatar format="small"/>
            <Text>
                <h3>Margie{username}</h3>
                <p>{tagline} on a Fellini flex</p>
            </Text>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 85%;
    margin: 20px auto;
    display: flex;
    align-items: center;

    `;

const Text = styled.div`
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