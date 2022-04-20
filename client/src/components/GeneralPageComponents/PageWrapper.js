import styled from "styled-components";
import { useContext } from "react";
import { CurrentUserContext } from "../Profile/CurrentUserContext";
import Header from "./Header";
import NavigationFooter from "./NavigationFooter";

//Each page is styled for iPhone 12/13 dimensions
const PageWrapper = ({children}) => {

    const { token } = useContext(CurrentUserContext);    
    
    return (
        <>
        {((window.location.pathname === "/") || (window.location.pathname === "/signup") || !token)? (
            <Wrapper>{children}</Wrapper>
            ) : (
            <Wrapper>
            <Header />

                {children}

                {!(window.location.pathname.includes('/tangent/')) &&
                <NavigationFooter />}
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
    overflow: hidden;
`

export default PageWrapper;