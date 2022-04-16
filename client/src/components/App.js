import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import Header from "./Header";
import LandingPage from "./LandingPage";
import FeedPage from "./FeedPage";
import Profile from "./Profile/Profile";
import Tangent from "./Tangent";
import PointsInTangent from "./PointsInTangent";
import PointDetails from "./PointDetails";
import MyCircle from "./MyCircle/MyCircle";
import MyTangents from "./MyTangents";
import moment from 'moment';
import Search from "./Search";


function App() {

  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Main>
      <GlobalStyles />
     
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/feed" element={<FeedPage />} />

          {/* <Route path="/tangents/:tangentId" element={<Tangent />} /> */}
          <Route path="/tangent" element={<Tangent />} />

          <Route path="/tangents" element={<MyTangents />} />

          <Route path="/:tangentId/points" element={<PointsInTangent />} />

          <Route path="/point/:pointId" element={<PointDetails />} />

          <Route path="/profile/:userId" element={<Profile />} />

          <Route path="/my-circle" element={<MyCircle />} />

          <Route path="/search" element={<Search />} />
        </Routes>

    </BrowserRouter>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  justify-content: center;
`;

export default App;
