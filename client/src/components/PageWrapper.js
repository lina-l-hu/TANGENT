import styled from "styled-components";
import Header from "./Header";
import NavigationFooter from "./NavigationFooter";

//Each page is styled for iPhone 12/13 dimensions
const PageWrapper = ({children}) => {
    
    return (
        <>
        {(window.location.pathname === "/") ? (
            <Wrapper>{children}</Wrapper>
            ) : (
            <Wrapper>
            {!(window.location.href.indexOf("profile") > -1) &&
    
                <Header />
            }
                {children}

                {/* {!(window.location.href.indexOf("tangent") > -1) &&
                <NavigationFooter />} */}

                {(window.location.pathname !== "/tangent" &&
                <NavigationFooter />)}
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