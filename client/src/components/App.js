import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useContext } from "react";
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
import moment from 'moment';
import Search from "./Search";
import AddTangentModal from "../components/Tangent/AddTangentModal";
import UserSignup from "./Login/UserSignup";
import LoginComponent from "./Login/LoginComponent";
import SignupComponent from "./Login/SignupComponent";
import NavigationFooter from "./GeneralPageComponents/NavigationFooter";
import { CurrentUserContext } from "./Profile/CurrentUserContext";


function App() {

  const { token, actions: {setToken} } = useContext(CurrentUserContext);

  // if (!token) {
  //   return 
  //   <SignupComponent setToken={setToken} />
  // }

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

          <Route path="/" element={<LandingPage />} />

          <Route path="/signup" element={<UserSignup />} />

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
