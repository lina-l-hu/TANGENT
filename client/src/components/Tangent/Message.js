import styled from "styled-components";
import Avatar from "../Avatar";

const Message = ({msg}) => {

    //different styling depending on if the message is from the signed-in user 
    return (
        <Wrapper>
            <div>
                <Avatar />
            </div>
            <Text>
            Inherits this property from its parent element. 
            Inherits this property from its parent element.
            Inherits this property from its parent element.
            </Text>
            
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 85%;
    display: flex;
    margin: 15px 0;

    div {
        margin-top: 3px;
    }
`;

const Text = styled.p`
    border: 1px solid white;
    border-radius: 15px;
    margin-left: 10px;
    width: 275px;
    overflow: auto;
    padding: 10px;
`

export default Message;