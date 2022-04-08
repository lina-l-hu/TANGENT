import styled from "styled-components";
import Avatar from "./Avatar";

const TangentPreview = () => {
    
    //every preview is a link or button with navigate 
    //make a class for these and point previews so that they resize on click
    
    return (
        <Wrapper>
            <Avatar userLetter="M" />
            <div>
                <p>message</p>
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    width: 85%;
    margin: 20px auto;
    border: 4px solid white;
    background-color: rgba(255, 255, 255, 0.5);
    color: white;
    padding: 10px;

    div {
        * {
            line-height: 26px;
            margin-left: 10px;
        }
    }
`;

export default TangentPreview;