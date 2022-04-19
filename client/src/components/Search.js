import styled from "styled-components";
import PageWrapper from "./PageWrapper"
import Header from "./Header";

const Search = () => {
    return (
    <PageWrapper>
        {/* <Header>search</Header> */}
        <Body></Body>
        <Spacer></Spacer>
    </PageWrapper>
    )
}

const Spacer = styled.div`
    height: 70px;
`;

const Body = styled.div`
`;
export default Search;