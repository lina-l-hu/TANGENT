import styled from "styled-components";

const Textbox = () => {

    return (
        <Wrapper>
            <textarea autoFocus rows="1"></textarea>
            <button>send</button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* border: 2px solid white; */
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0 auto;
    border-radius: 0;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.5);
    /* height: 50px; */
    padding: 12px 5px;

    textarea {
        border-radius: 30px;
        background-color: var(--color-main-transparent);
        border: none;
        resize: none;
        outline: none;
        width: 73%;
        font-size: 20px;
        font-family: var(--font-body);
        padding: 10px 5px;
        color: white;
    }

    button {
        font-size: 20px;
        padding: 8px 12px;
        border-radius: 18px;
        
    }
`;

export default Textbox;