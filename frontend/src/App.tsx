import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ApiProvider } from './lib/api';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PropertyListPage from './pages/properties/PropertyListPage';
import PropertyDetailPage from './pages/properties/PropertyDetailPage';
import PropertyCreatePage from './pages/properties/PropertyCreatePage';
import OfferListPage from './pages/offers/OfferListPage';
import OfferDetailPage from './pages/offers/OfferDetailPage';
import OfferCreatePage from './pages/offers/OfferCreatePage';
import ProfilePage from './pages/profile/ProfilePage';
import CreditsPage from './pages/credits/CreditsPage';

// Komponenta pro ochranu cest
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Zde by byla logika pro kontrolu přihlášení
  const isAuthenticated = false; // Toto by bylo nahrazeno skutečnou kontrolou
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ApiProvider>
          <Routes>
            {/* Veřejné stránky */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            
            {/* Autentizační stránky */}
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            
            {/* Chráněné stránky */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="credits" element={<CreditsPage />} />
            </Route>
            
            {/* Nemovitosti */}
            <Route path="/properties" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<PropertyListPage />} />
              <Route path="create" element={<PropertyCreatePage />} />
              <Route path=":id" element={<PropertyDetailPage />} />
            </Route>
            
            {/* Nabídky */}
            <Route path="/offers" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<OfferListPage />} />
              <Route path="create/:propertyId" element={<OfferCreatePage />} />
              <Route path=":id" element={<OfferDetailPage />} />
            </Route>
            
            {/* Fallback pro neexistující cesty */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ApiProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
