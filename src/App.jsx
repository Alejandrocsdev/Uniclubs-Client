// CSS
import './assets/css/font.css';
import './assets/css/global.css';
// Libraries
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Custom Functions
import { MessageProvider } from './contexts/MessageContext';
import { AuthProvider } from './contexts/AuthContext';
import { useLoader } from './hooks';
// Components
import Error from './components/Error';
import Message from './components/Message';
// Layout
import MainLayout from './layouts/MainLayout';
// Laoder
import ScreenLoader from './loaders/ScreenLoader';
// Routes
import Protected from './routes/Protected';
// Public Pages
import Sign from './pages/Sign';
import Recovery from './pages/Recovery';
import LandingPage from './pages/LandingPage';
// Private Pages
import Home from './pages/Home';
import Booking from './pages/Booking';
import Components from './pages/Components';
import MemberManagement from './pages/MemberManagement';
import Profile from './pages/Profile';

function App() {
  const { loading, error } = useLoader();

  if (loading) return <ScreenLoader />;

  if (error) return <Error full />;

  return (
    <BrowserRouter>
      <AuthProvider>
        <MessageProvider>
          {/* Global Message */}
          <Message />

          <Routes>
            {/* Landing Page - Public Route */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign-in" element={<Sign />} />
              <Route path="/user/sign-up" element={<Sign />} />
              <Route path="/recovery/password" element={<Recovery />} />
              <Route path="/recovery/username" element={<Recovery />} />
            </Route>

            {process.env.NODE_ENV === 'development' && (
              <Route element={<MainLayout />}>
                <Route path="/dev/booking" element={<Booking />} />
                <Route path="/dev/member-management" element={<MemberManagement />} />
                <Route path="/dev/profile" element={<Profile />} />
              </Route>
            )}
            
            {/* Private Routes */}
            <Route
              element={
                <Protected allowedRoles={['guest', 'user', 'admin', 'owner']} />
              }
            >
              <Route element={<MainLayout />}>
                <Route path="/booking" element={<Booking />} />
                <Route path="/member-management" element={<MemberManagement />} />
                <Route path="/components" element={<Components />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Catch-all fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MessageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
