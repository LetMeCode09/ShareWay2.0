import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { t } from "../i18n/en";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    const linkStyle = ({ isActive }) => ({
        textDecoration: "none",
        padding: "8px 10px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: isActive ? "#eee" : "transparent",
    });

    const isAdmin = user?.role === "ADMIN";

    return (
        <div className="container">
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h1 style={{ margin: 0, fontSize: 22 }}>{t.appTitle}</h1>
                <nav className="nav-buttons">
                    <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
                    <NavLink to="/trips" style={linkStyle}>{t.navTrips}</NavLink>
                    {isAdmin && <NavLink to="/users" style={linkStyle}>{t.navUsers}</NavLink>}
                    {isAdmin && <NavLink to="/reservations" style={linkStyle}>{t.navReservations}</NavLink>}
                </nav>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {user && (
                        <span style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 700 }}>
                            {user.email}
                            <span style={{
                                marginLeft: 6,
                                fontSize: "0.72rem",
                                background: "var(--brand-soft)",
                                color: "var(--brand)",
                                padding: "2px 7px",
                                borderRadius: 999,
                                fontWeight: 800,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em"
                            }}>{user.role}</span>
                        </span>
                    )}
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ fontSize: "0.85rem" }}>
                        Sign out
                    </button>
                </div>
            </header>

            <main style={{ marginTop: 16 }}>
                <Outlet />
            </main>
        </div>
    );
}