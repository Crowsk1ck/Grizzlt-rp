import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Roster from './pages/Roster.jsx';
import Hierarchy from './pages/Hierarchy.jsx';
import Recruitment from './pages/Recruitment.jsx';
import Rules from './pages/Rules.jsx';
import Events from './pages/Events.jsx';
import Gallery from './pages/Gallery.jsx';
import Achievements from './pages/Achievements.jsx';
import Diplomacy from './pages/Diplomacy.jsx';
import Business from './pages/Business.jsx';
import News from './pages/News.jsx';
import Contact from './pages/Contact.jsx';
import Profile from './pages/Profile.jsx';
import DatabasePage from './pages/Database.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/hierarchy" element={<Hierarchy />} />
        <Route path="/recruitment" element={<Recruitment />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/diplomacy" element={<Diplomacy />} />
        <Route path="/business" element={<Business />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
