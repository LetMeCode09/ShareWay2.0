import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== "ADMIN") return <Navigate to="/dashboard" replace />;
    return children;
}
import Layout from "./components/Layout.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";

// Trips
import TripsList from "./pages/trips/TripsList.jsx";
import TripDetails from "./pages/trips/TripDetails.jsx";
import TripForm from "./pages/trips/TripForm.jsx";

// Users
import UserList from "./pages/users/UserList.jsx";
import UserDetails from "./pages/users/UserDetails.jsx";
import UserForm from "./pages/users/UserForm.jsx";

// Reservations
import ReservationList from "./pages/reservations/ReservationList.jsx";
import ReservationDetails from "./pages/reservations/ReservationDetails.jsx";
import ReservationForm from "./pages/reservations/ReservationForm.jsx";

function RootRedirect() {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
    return (
        <Routes>
            {/* Public: login / register (sin Layout) */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected: todo dentro del Layout */}
            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route path="/" element={<RootRedirect />} />

                <Route path="/dashboard" element={<Dashboard />} />

                {/* Trips */}
                <Route path="/trips"          element={<TripsList />} />
                <Route path="/trips/new"      element={<TripForm mode="create" />} />
                <Route path="/trips/:id"      element={<TripDetails />} />
                <Route path="/trips/:id/edit" element={<TripForm mode="edit" />} />

                {/* Users — solo ADMIN */}
                <Route path="/users"          element={<AdminRoute><UserList /></AdminRoute>} />
                <Route path="/users/new"      element={<AdminRoute><UserForm mode="create" /></AdminRoute>} />
                <Route path="/users/:id"      element={<AdminRoute><UserDetails /></AdminRoute>} />
                <Route path="/users/:id/edit" element={<AdminRoute><UserForm mode="edit" /></AdminRoute>} />

                {/* Reservations — solo ADMIN */}
                <Route path="/reservations"          element={<AdminRoute><ReservationList /></AdminRoute>} />
                <Route path="/reservations/new"      element={<AdminRoute><ReservationForm mode="create" /></AdminRoute>} />
                <Route path="/reservations/:id"      element={<AdminRoute><ReservationDetails /></AdminRoute>} />
                <Route path="/reservations/:id/edit" element={<AdminRoute><ReservationForm mode="edit" /></AdminRoute>} />

                <Route path="*" element={<div>Not found</div>} />
            </Route>
        </Routes>
    );
}