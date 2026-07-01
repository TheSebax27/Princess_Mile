import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Messages } from './pages/Messages';
import { Gallery } from './pages/Gallery';
import { Playlist } from './pages/Playlist';
import { AboutHer } from './pages/AboutHer';
import { Timeline } from './pages/Timeline';
import { Book } from './pages/Book';
import { Planes } from './pages/Planes';
import { Secret } from './pages/Secret';
import { Settings } from './pages/Settings';

function Gate() {
  const { isUnlocked } = useAuth();

  if (!isUnlocked) return <Login />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/mensajes" element={<Messages />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/quien-es" element={<AboutHer />} />
        <Route path="/fechas" element={<Timeline />} />
        <Route path="/libro" element={<Book />} />
        <Route path="/planes" element={<Planes />} />
        <Route path="/secreto" element={<Secret />} />
        <Route path="/configuracion" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#151515',
              color: '#fff',
              border: '1px solid #242424',
            },
          }}
        />
        <Gate />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
