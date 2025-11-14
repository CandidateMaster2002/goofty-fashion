import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppDataProvider, useAppData } from './hooks/useAppData';
import { Header } from './components/Header';
import { HomePage } from './pages/storefront/HomePage';
import { ShopPage } from './pages/storefront/ShopPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { AdminPageLayout } from './pages/admin/AdminPageLayout';
import { InventoryPage } from './pages/admin/InventoryPage';
import { RentalsPage } from './pages/admin/RentalsPage';
import { OrdersPage } from './pages/admin/OrdersPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { Role } from './types';

const AppContent: React.FC = () => {
  const { loading, error, currentRole } = useAppData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading Goofty Fashions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Routes>
        {/* Storefront Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPageLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="rentals" element={<RentalsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route index element={<Navigate to={currentRole === Role.Customer ? "/" : "/admin/dashboard"} replace />} />
        </Route>
        
        {/* Redirect logic */}
        <Route path="*" element={<Navigate to={currentRole === Role.Customer ? "/" : "/admin/dashboard"} replace />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppDataProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppDataProvider>
  );
};

export default App;
