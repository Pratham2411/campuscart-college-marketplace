import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CreateListingPage from "./pages/CreateListingPage.jsx";
import EditListingPage from "./pages/EditListingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MarketplacePage from "./pages/MarketplacePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <CreateListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:productId/edit"
          element={
            <ProtectedRoute>
              <EditListingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
