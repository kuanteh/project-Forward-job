import { useState , useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import NavBar from "./components/NavBar";
import Classroom from "./pages/Classroom";
import EventSpace from "./pages/EventSpace";
import Kitchen from "./pages/Kitchen";
import MeetingRoom1 from "./pages/MeetingRoom1";
import Office from "./pages/Office";
import PingPong from "./pages/PingPong";

import './App.css'
import GtaForwardMap from './pages/GtaForwardMap';

function App() {

  return (
      <div className="app bottom-navbar">
          {/* Sidenav shared across all pages */}
          <Navbar />

          {/* Main content area with route definitions */}
          <main className="main-content">
              <div className="container">
                  <Routes>
                      <Route path="/" element={<GtaForwardMap />} />
                      <Route path="/classroom" element={<Classroom />} />
                      <Route path="/eventSpace" element={<EventSpace />} />
                      <Route path="/kitchen" element={<Kitchen />} />
                      <Route path="/meetingroom1" element={<MeetingRoom1 />} />
                      <Route path="/office" element={<Office />} />
                      <Route path="/pingpong" element={<PingPong />} />
                  </Routes>
              </div>
          </main>
      </div>
  );
}

export default App
