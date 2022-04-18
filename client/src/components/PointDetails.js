import styled from "styled-components";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "./TangentPreview";
import Header from "./Header";


const PointDetails = () => {
    return (
        <PageWrapper>
            <Header>point name</Header>
            <PointPreview format="full" />
            <MentionedDiv>mentioned in these Tangents</MentionedDiv>
            <TangentPreview />
        </PageWrapper>
    )
}

const MentionedDiv = styled.h3`
    margin: 10px auto;
    font-style: italic;
`;

export default PointDetails;