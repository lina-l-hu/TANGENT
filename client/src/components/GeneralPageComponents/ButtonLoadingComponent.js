import styled from "styled-components";

//animation modified from https://tobiasahlin.com/spinkit/
const ButtonLoadingComponent = () => {
    return <Wrapper>
        <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
        </div>
    </Wrapper>
}

const Wrapper = styled.div`
    .spinner {
    width: 15px;
    height: 15px;

    position: relative;
    margin: 2.5px auto;
    }

    .double-bounce1, .double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #ffffff;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    
    -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
    animation: sk-bounce 2.0s infinite ease-in-out;
    }
    .double-bounce2 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
    }

    @-webkit-keyframes sk-bounce {
    0%, 100% { -webkit-transform: scale(0.0) }
    50% { -webkit-transform: scale(1.0) }
    }

    @keyframes sk-bounce {
    0%, 100% { 
        transform: scale(0.0);
        -webkit-transform: scale(0.0);
    } 50% { 
        transform: scale(1.0);
        -webkit-transform: scale(1.0);
    }
    }
`;
export default ButtonLoadingComponent;