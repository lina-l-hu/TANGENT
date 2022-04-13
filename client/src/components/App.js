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
import moment from 'moment';


function App() {

  const [ displayNav, setDisplayNav ] = useState(false);
  const [ displayAddTangentModal, setDisplayAddTangentModal] = useState(false);

  console.log(moment().format("YYYY-MM-DD HH:mm"));

  return (
    <Main>
      <GlobalStyles />
     
      <BrowserRouter>

        <Routes>

          <Route path="/" element={<LandingPage />} />

          <Route path="/feed" element={<FeedPage />} />

          <Route path="/tangent" element={<Tangent />} />

          <Route path="/points" element={<PointsInTangent />} />

          <Route path="/point" element={<PointDetails />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/my-circle" element={<MyCircle />} />

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
