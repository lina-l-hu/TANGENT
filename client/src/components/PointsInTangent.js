import styled from "styled-components";
import { useParams } from "react-router-dom";
import PageWrapper from "./PageWrapper";
import PointPreview from "./PointPreview";

const PointsInTangent = () => {

    const { tangentId } = useParams();
    console.log("tangentId", tangentId);

    return (
        <PageWrapper>
            {/* <PointPreview /> */}
        </PageWrapper>
    )
}

export default PointsInTangent;