import { NavLink, Outlet } from "react-router-dom";
import { t } from "../i18n/en";

export default function Layout() {
    const linkStyle = ({ isActive }) => ({
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: isActive ? "#eee" : "transparent",
    });

    return (
        <div className="container">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 22 }}>{t.appTitle}</h1>
            <nav className="nav-buttons">
            <NavLink to="/trips" style={linkStyle}>{t.navTrips}</NavLink>
            <NavLink to="/users" style={linkStyle}>{t.navUsers}</NavLink>
            <NavLink to="/reservations" style={linkStyle}>{t.navReservations}</NavLink>
            </nav>
        </header>

        <main style={{ marginTop: 16 }}>
            <Outlet />
        </main>
        </div>
    );
}
