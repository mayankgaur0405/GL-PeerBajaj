import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Feed from './pages/Feed.jsx';
import Trending from './pages/Trending.jsx';
import Chat from './pages/Chat.jsx';
import Team from './pages/Team.jsx';
import Guide from './pages/Guide.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Private route component
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <Navbar />
            <main className="container mx-auto px-4 py-6 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/feed"
                element={
                  <PrivateRoute>
                    <Feed />
                  </PrivateRoute>
                }
              />
              <Route path="/trending" element={<Trending />} />
              <Route path="/team" element={<Team />} />
              <Route path="/guide" element={<Guide />} />
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                }
              />
              {/* Optional: Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </main>
          </div>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
