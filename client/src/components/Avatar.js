import styled from "styled-components";

const Avatar = ({avatarImgSrc, userLetter, format}) => {
    
    //if format large, larger width, use props

    return (
        <>
        { avatarImgSrc ? (
        <Wrapper large={(format === "large")}>
            <img src={avatarImgSrc} />
        </Wrapper>
        ) : ( 
            <Wrapper large={(format === "large")}>{userLetter}</Wrapper>
        )}
        </>
    )
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-family: var(--font-heading);
    font-weight: bold;
    font-size: 30px;
    background-color: white;
    width: ${props => (props.large ? "100px" : "40px")};
    height: ${props => (props.large ? "100px" : "40px")};
    color: var(--color-main);
`;

export default Avatar;