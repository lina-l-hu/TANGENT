import styled from "styled-components";
import PageWrapper from "./PageWrapper";
import Header from "./Header";
import TangentPreview from "./TangentPreview";
import PointPreview from "./PointPreview";

const FeedPage = () => {
    return (
    <PageWrapper>
        <Header>feed</Header>
        <Body>
            <MostPopularPoint className="section">
                <h3>Talk of the day</h3>
                <PointPreview />
            </MostPopularPoint>

            <MostPopularTangents className="section">
                <h3>Major discussions</h3>
                {/* get top 3 tangents and map over them to display */}
                <TangentPreview />
                <TangentPreview />
            </MostPopularTangents>

            <NewTangents className="section">
                <h3>Something to add?</h3>
                {/* get 2 most recent tangents from friends and map over them to display */}
                <TangentPreview />
                <TangentPreview />
            </NewTangents>
        </Body>
        
    </PageWrapper>
    )
}

const Body = styled.div`
    .section {
        margin: 30px 0;
        color: white;
    }

    h3 {
        text-align: center;
        font-style: italic;
    }
    
`;

const MostPopularPoint = styled.div`
`;

const MostPopularTangents = styled.div`

`;

const NewTangents = styled.div`
`;

export default FeedPage;