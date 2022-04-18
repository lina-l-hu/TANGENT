import styled from "styled-components";
import { useParams } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";
import TangentPreview from "./TangentPreview";
import Header from "./Header";

const PointsInTangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);

    return (
        <PageWrapper>
            <Header titleSize="smaller">points in tangent name</Header>
            {/* <PointPreview /> */}
            <TangentPreview />
        </PageWrapper>
    )
}

export default PointsInTangent;