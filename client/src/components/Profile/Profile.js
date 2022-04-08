import styled from "styled-components";
import { useState } from "react";
import PageWrapper from "../PageWrapper";
import Header from "../Header";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import TangentPreview from "../TangentPreview";
import PointPreview from "../PointPreview";

const Profile = () => {

    //if profile is not a friend of the current user's, display add to my circle button

    const [ tab, setTab ] = useState("tangents");

    return (
        <PageWrapper>
            {/* <Header>profile</Header> */}
            <ProfileHeader />
            <ProfileTabs tab={tab} setTab={setTab}/>

            {( tab === "tangents") ? (
                <TangentPreview />
                ) : (
                <PointPreview />
            )}
        </PageWrapper>
    )
}

export default Profile;