import styled from "styled-components";
import PageWrapper from "../components/GeneralPageComponents/PageWrapper"
import Header from "./GeneralPageComponents/Header";

const Search = () => {

    return (
    <PageWrapper>
        <Body></Body>
        <Spacer></Spacer>
    </PageWrapper>
    )
}

const Spacer = styled.div`
    height: 70px;
`;

const Body = styled.div`
    overflow: scroll;
`;
export default Search;