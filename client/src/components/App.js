import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import styled from "styled-components";
import GlobalStyles from "./GlobalStyles";
import LandingPage from "./LandingPage";
import FeedPage from "./FeedPage";
import Profile from "./Profile/Profile";
import Tangent from "./Tangent";
import PointsInTangent from "./PointComponents/PointsInTangent";
import PointDetails from "./PointComponents/PointDetails";
import MyCircle from "./MyCircle/MyCircle";
import MyTangents from "./Tangent/MyTangents";
import Search from "./Search";
import AddTangentModal from "../components/Tangent/AddTangentModal";
import { CurrentUserContext } from "./Profile/CurrentUserContext";


function App() {

  const { token, actions: {setToken} } = useContext(CurrentUserContext);

  return (
    <Main>
      <GlobalStyles />
     
      <BrowserRouter>

      {(!token) ? (
        <LandingPage />

      ) : (

        <>
        <AddTangentModal />

        <Routes>

          <Route path="/" element={<Navigate to="/feed" replace />} />

          <Route path="/feed" element={<FeedPage />} />

          <Route path="/tangent/:tangentId" element={<Tangent />} />

          <Route path="/tangents" element={<MyTangents />} />

          <Route path="/:tangentId/points" element={<PointsInTangent />} />

          <Route path="/points/:pointId" element={<PointDetails />} />

          <Route path="/profile/:userId" element={<Profile />} />

          <Route path="/my-circle" element={<MyCircle />} />

          <Route path="/search" element={<Search />} />
        </Routes>
        </>
        )}
    </BrowserRouter>
    </Main>
  );
}

const Main = styled.div`
  display: flex;
  justify-content: center;
`;

export default App;
