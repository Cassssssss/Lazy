import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import System from './pages/System';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Bookmarks from './pages/Bookmarks';
import DocumentView from './pages/DocumentView';
import Auth from './pages/Auth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/system/:systemId" element={<System />} />
                    <Route path="/system/:systemId/folder/:folderId" element={<Documents />} />
                    <Route path="/system/:systemId/document/:documentId" element={<DocumentView />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/bookmarks" element={<Bookmarks />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;