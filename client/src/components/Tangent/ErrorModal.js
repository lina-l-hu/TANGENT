//Modal that shows error during searching for Points
import styled from "styled-components";
import { useRef } from "react";

const ErrorModal = ({errorMessage, displayErrorModal, displaySuggestionsDropup, setDisplayErrorModal, setDisplaySuggestionsDropup}) => {
    const nodeRef = useRef();

    const handleClose = () => {
        setDisplayErrorModal(false);
        setDisplaySuggestionsDropup(true);
    }

    window.onclick = function(event) {
        if (nodeRef.current && !nodeRef.current.contains(event.target)) {
            setDisplayErrorModal(false);
            setDisplaySuggestionsDropup(true);
        }
    }

    return (
        <Wrapper isDisplay={(displayErrorModal)} ref={nodeRef}>
            <Content>
                <CloseDiv>
                    <CloseButton onClick={handleClose}>&times;</CloseButton>
                </CloseDiv>
                <Message>{errorMessage}</Message>
            </Content>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* display: block; */
    display: ${props => (props.isDisplay ? 'block' : 'none')};
    position: absolute;
    /* position: fixed; */
    z-index: 100; 
    bottom: 58px;
    left: 30px;
    width: 235px;
`;

const Content = styled.div`
    background-color: RGBA(170, 170, 170, 0.6);
    padding: 7px 7px 15px 7px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* border: 3px solid var(--color-highlight); */
    /* min-width: 100px;
    min-height: 100px; */
`;

const CloseDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: -20px;
    width: 80%;
`;

const CloseButton = styled.div`
    color: white;
    font-size: 16px;
    cursor: pointer;
`;

const Message = styled.p`
    color: purple;
    font-style: italic;
    text-align: center;
    font-size: 16px;
`

export default ErrorModal;