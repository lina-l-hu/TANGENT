import styled from "styled-components";
import PageWrapper from "../PageWrapper";
import UserPreview from "./UserPreview";
import Header from "../Header";

const MyCircle = () => {
    return (
        <PageWrapper>
            <Header>my circle</Header>
            <UserPreview username="" tagline=""/>
        </PageWrapper>
    )
}

export default MyCircle;