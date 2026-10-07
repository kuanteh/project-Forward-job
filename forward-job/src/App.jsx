import { BrowserRouter, Routes, Route } from "react-router";
import Character from "./pages/Character";
import Classroom from "./pages/Classroom";
import Counter from "./pages/Counter";
import EventSpace from "./pages/EventSpace";
import Kitchen from "./pages/Kitchen";
import MeetingRoom1 from "./pages/MeetingRoom1";
import Office from "./pages/Office";
import PingPong from "./pages/Pingpong";
import GtaForwardMap from "./pages/GtaForwardMap";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Character />} />
                <Route path="/map" element={<GtaForwardMap />} />
                <Route path="/classroom" element={<Classroom />} />
                <Route path="/counter" element={<Counter />} />
                <Route path="/eventSpace" element={<EventSpace />} />
                <Route path="/kitchen" element={<Kitchen />} />
                <Route path="/meetingroom1" element={<MeetingRoom1 />} />
                <Route path="/office" element={<Office />} />
                <Route path="/pingpong" element={<PingPong />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
