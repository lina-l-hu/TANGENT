import styled from "styled-components";
import Header from "./Header";
import NavigationFooter from "./NavigationFooter";

//Each page is styled for iPhone 12/13 dimensions
const PageWrapper = ({children}) => {
    
    //if the pathname has tangent, profile or point in the name, do not include generic header
    
    // return (
    //     <Wrapper>{children}</Wrapper>
    // )
    return (
        <>
        {((window.location.pathname === "/") || (window.location.pathname === "/signup") )? (
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