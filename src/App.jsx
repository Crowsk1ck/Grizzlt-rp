import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Roster = lazy(() => import('./pages/Roster.jsx'));
const Hierarchy = lazy(() => import('./pages/Hierarchy.jsx'));
const Recruitment = lazy(() => import('./pages/Recruitment.jsx'));
const Calculator = lazy(() => import('./pages/Calculator.jsx'));
const Progress = lazy(() => import('./pages/Progress.jsx'));
const Ranks = lazy(() => import('./pages/Ranks.jsx'));
const Rules = lazy(() => import('./pages/Rules.jsx'));
const Events = lazy(() => import('./pages/Events.jsx'));
const Calendar = lazy(() => import('./pages/Calendar.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Achievements = lazy(() => import('./pages/Achievements.jsx'));
const Diplomacy = lazy(() => import('./pages/Diplomacy.jsx'));
const Business = lazy(() => import('./pages/Business.jsx'));
const News = lazy(() => import('./pages/News.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const DatabasePage = lazy(() => import('./pages/Database.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const AdminMembers = lazy(() => import('./pages/AdminMembers.jsx'));
const AdminBot = lazy(() => import('./pages/AdminBot.jsx'));
const GrizzlyOS = lazy(() => import('./pages/GrizzlyOS.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/roster" element={<Roster />} />
          <Route path="/hierarchy" element={<Hierarchy />} />
          <Route path="/recruitment" element={<Recruitment />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ranks" element={<Ranks />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/events" element={<Events />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/diplomacy" element={<Diplomacy />} />
          <Route path="/business" element={<Business />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/bot" element={<AdminBot />} />
          <Route path="/grizzly-os" element={<GrizzlyOS />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
