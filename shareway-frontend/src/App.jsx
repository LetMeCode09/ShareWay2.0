import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";

// Trips
import TripsList from "./pages/trips/TripsList.jsx";
import TripDetails from "./pages/trips/TripDetails.jsx";
import TripForm from "./pages/trips/TripForm.jsx";

// Users (OJO: UserList.jsx)
import UserList from "./pages/users/UserList.jsx";
import UserDetails from "./pages/users/UserDetails.jsx";
import UserForm from "./pages/users/UserForm.jsx";

// Reservations (OJO: ReservationList.jsx)
import ReservationList from "./pages/reservations/ReservationList.jsx";
import ReservationDetails from "./pages/reservations/ReservationDetails.jsx";
import ReservationForm from "./pages/reservations/ReservationForm.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/trips" replace />} />

        {/* Trips */}
        <Route path="/trips" element={<TripsList />} />
        <Route path="/trips/new" element={<TripForm mode="create" />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/trips/:id/edit" element={<TripForm mode="edit" />} />

        {/* Users */}
        <Route path="/users" element={<UserList />} />
        <Route path="/users/new" element={<UserForm mode="create" />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/users/:id/edit" element={<UserForm mode="edit" />} />

        {/* Reservations */}
        <Route path="/reservations" element={<ReservationList />} />
        <Route path="/reservations/new" element={<ReservationForm mode="create" />} />
        <Route path="/reservations/:id" element={<ReservationDetails />} />
        <Route path="/reservations/:id/edit" element={<ReservationForm mode="edit" />} />

        <Route path="*" element={<div>Not found</div>} />
      </Route>
    </Routes>
  );
}