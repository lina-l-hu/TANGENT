import styled from "styled-components";
import {AdvancedImage} from '@cloudinary/react';
import {Cloudinary} from "@cloudinary/url-gen";

//Avatar image for message and tangent previews
const Avatar = ({avatarImgSrc, userLetter, format}) => {
    var cl = new Cloudinary({cloud_name: "lina777", secure: true});
    
    return (
        <>
        { (avatarImgSrc) ? (
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
    font-size: ${props => (props.large ? "60px" : "30px")};
    background-color: white;
    width: ${props => (props.large ? "100px" : "40px")};
    height: ${props => (props.large ? "100px" : "40px")};
    color: var(--color-main);


    img {
        border-radius: 50%;
        width: ${props => (props.large ? "100px" : "40px")};
        height: ${props => (props.large ? "100px" : "40px")};
    }
`;

export default Avatar;