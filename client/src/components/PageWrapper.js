import styled from "styled-components";
import Header from "./Header";

//Each page is styled for iPhone 12/13 dimensions
const PageWrapper = ({children}) => {
    
    return (
        <>
        {(window.location.pathname === "/") ? (
            <Wrapper></Wrapper>
            ) : (
            <Wrapper>
                <Header />
                {children}
            </Wrapper>
        )}
        </>
    ) 
}

const Wrapper = styled.div`
    width: 390px;
    height: 844px;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    position: relative;
    overflow: scroll;
`

export default PageWrapper;