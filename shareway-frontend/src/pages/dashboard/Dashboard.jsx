import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips } from "../../api/tripsApi";
import { getUsers } from "../../api/usersApi";
import { getReservations } from "../../api/reservationsApi";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    return user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />;
}

// ── ADMIN ──────────────────────────────────────────────────────────────────

function AdminDashboard() {
    const [trips, setTrips]               = useState([]);
    const [users, setUsers]               = useState([]);
    const [reservations, setReservations] = useState([]);
    const [status, setStatus]             = useState("idle");
    const [error, setError]               = useState(null);

    async function load() {
        try {
            setStatus("loading");
            setError(null);
            const [t, u, r] = await Promise.all([getTrips(), getUsers(), getReservations()]);
            setTrips(Array.isArray(t) ? t : []);
            setUsers(Array.isArray(u) ? u : []);
            setReservations(Array.isArray(r) ? r : []);
            setStatus("success");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
    }

    useEffect(() => { load(); }, []);

    const stats = useMemo(() => {
        const confirmed = reservations.filter(r => r.confirmed);
        const pending   = reservations.filter(r => !r.confirmed);
        const available = trips.filter(t => !t.full);
        const full      = trips.filter(t => t.full);
        const revenue   = reservations.reduce((acc, r) => acc + (r.totalPrice ?? 0), 0);
        return { confirmed, pending, available, full, revenue };
    }, [trips, users, reservations]);

    const recentReservations = useMemo(() =>
        [...reservations]
            .map(r => ({
                ...r,
                userName:  r.user?.name  ?? `User #${r.user?.id ?? "?"}`,
                tripLabel: r.trip
                    ? `${r.trip.origin ?? "?"} → ${r.trip.destination ?? "?"}`
                    : "—",
            }))
            .sort((a, b) => String(b.reservationDate).localeCompare(String(a.reservationDate)))
            .slice(0, 10),
        [reservations]
    );

    const lowSeatsTrips = useMemo(() =>
        trips
            .filter(t => !t.full && (t.availableSeats ?? 99) <= 2)
            .sort((a, b) => (a.availableSeats ?? 0) - (b.availableSeats ?? 0)),
        [trips]
    );

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
                        System overview — manage trips, users and reservations
                    </p>
                </div>
                <button onClick={load} className="btn btn-ghost">Refresh</button>
            </div>

            {status === "loading" && <Loading text="Loading dashboard..." />}
            {status === "error"   && <ErrorBox error={error} onRetry={load} />}

            {status === "success" && (
                <>
                    {/* ── KPIs ── */}
                    <div className="stat-grid" style={{ gridTemplateColumns: "repeat(6, minmax(0,1fr))", marginBottom: 24 }}>
                        <StatCard label="Total Trips"  value={trips.length} />
                        <StatCard label="Available"    value={stats.available.length} accent />
                        <StatCard label="Full"         value={stats.full.length} />
                        <StatCard label="Users"        value={users.length} />
                        <StatCard label="Reservations" value={reservations.length} />
                        <StatCard label="Revenue"      value={`${stats.revenue}€`} accent />
                    </div>

                    {/* ── Recent reservations ── */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 0 6px" }}>
                        <div>
                            <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Recent reservations</span>
                            <span style={{ color: "var(--muted)", fontSize: "0.82rem", marginLeft: 8 }}>last 10 by date</span>
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <span className="badge badge-ok">{stats.confirmed.length} confirmed</span>
                            <span className="badge badge-no">{stats.pending.length} pending</span>
                        </div>
                    </div>

                    {recentReservations.length === 0 ? (
                        <div className="state">No reservations yet.</div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>User</th>
                                        <th>Route</th>
                                        <th>Date</th>
                                        <th>Seats</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReservations.map(r => (
                                        <tr key={r.id}>
                                            <td style={{ color: "var(--muted)" }}>#{r.id}</td>
                                            <td>{r.userName}</td>
                                            <td>{r.tripLabel}</td>
                                            <td>{r.reservationDate ? String(r.reservationDate) : "—"}</td>
                                            <td>{r.numberOfSeats}</td>
                                            <td>{r.totalPrice}€</td>
                                            <td>
                                                <span className={r.confirmed ? "badge badge-ok" : "badge badge-no"}>
                                                    {r.confirmed ? "Confirmed" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Trips running low ── */}
                    {lowSeatsTrips.length > 0 && (
                        <>
                            <div style={{ margin: "20px 0 6px" }}>
                                <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Trips running low on seats</span>
                                <span style={{ color: "var(--muted)", fontSize: "0.82rem", marginLeft: 8 }}>≤ 2 seats left</span>
                            </div>
                            <div className="table-wrapper">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Route</th>
                                            <th>Date</th>
                                            <th>Transport</th>
                                            <th>Seats left</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowSeatsTrips.map(t => (
                                            <tr key={t.id}>
                                                <td>{t.origin} → {t.destination}</td>
                                                <td>{t.dateTime ? String(t.dateTime) : "—"}</td>
                                                <td>{t.transportTypes ?? "—"}</td>
                                                <td><span className="badge badge-no">{t.availableSeats}</span></td>
                                                <td>{t.price}€</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

// ── USER ───────────────────────────────────────────────────────────────────

function UserDashboard() {
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    const [allReservations, setAllReservations] = useState([]);
    const [trips, setTrips]                     = useState([]);
    const [status, setStatus]                   = useState("idle");
    const [error, setError]                     = useState(null);

    const [q, setQ]                         = useState("");
    const [dateFrom, setDateFrom]           = useState("");
    const [dateTo, setDateTo]               = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(true);

    const [sortCol, setSortCol] = useState("dateTime");
    const [sortDir, setSortDir] = useState("asc");

    async function load() {
        try {
            setStatus("loading");
            setError(null);
            const [t, r] = await Promise.all([getTrips(), getReservations()]);
            setTrips(Array.isArray(t) ? t : []);
            setAllReservations(Array.isArray(r) ? r : []);
            setStatus("success");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
    }

    useEffect(() => { load(); }, []);

    // Filtrar reservas del usuario autenticado por email
    const myReservations = useMemo(() =>
        allReservations.filter(r => r.user?.email === authUser?.email),
        [allReservations, authUser]
    );

    const myStats = useMemo(() => {
        const confirmed = myReservations.filter(r => r.confirmed);
        const pending   = myReservations.filter(r => !r.confirmed);
        const spent     = myReservations.reduce((acc, r) => acc + (r.totalPrice ?? 0), 0);
        return { confirmed, pending, spent };
    }, [myReservations]);

    const myReservationRows = useMemo(() =>
        [...myReservations]
            .map(r => ({
                ...r,
                tripLabel: r.trip
                    ? `${r.trip.origin ?? "?"} → ${r.trip.destination ?? "?"}`
                    : "—",
                tripDate: r.trip?.dateTime ?? null,
            }))
            .sort((a, b) => String(b.reservationDate).localeCompare(String(a.reservationDate))),
        [myReservations]
    );

    const availableTrips = useMemo(() => {
        const text = q.trim().toLowerCase();
        let list = [...trips];

        if (onlyAvailable) list = list.filter(t => !t.full);
        if (text) {
            list = list.filter(t =>
                [t.origin, t.destination, t.transportTypes, String(t.price)]
                    .filter(Boolean).join(" ").toLowerCase().includes(text)
            );
        }
        if (dateFrom) list = list.filter(t => t.dateTime && String(t.dateTime) >= dateFrom);
        if (dateTo)   list = list.filter(t => t.dateTime && String(t.dateTime) <= dateTo);

        list.sort((a, b) => {
            const va = a[sortCol] ?? "";
            const vb = b[sortCol] ?? "";
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1  : -1;
            return 0;
        });
        return list;
    }, [trips, q, dateFrom, dateTo, onlyAvailable, sortCol, sortDir]);

    function toggleSort(col) {
        if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortCol(col); setSortDir("asc"); }
    }
    const sortArrow = col => sortCol !== col ? " ↕" : sortDir === "asc" ? " ↑" : " ↓";

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>
                        Welcome back{authUser?.email ? `, ${authUser.email.split("@")[0]}` : ""}!
                    </h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
                        Your reservations and available trips
                    </p>
                </div>
                <button onClick={load} className="btn btn-ghost">Refresh</button>
            </div>

            {status === "loading" && <Loading text="Loading your dashboard..." />}
            {status === "error"   && <ErrorBox error={error} onRetry={load} />}

            {status === "success" && (
                <>
                    {/* ── Personal KPIs ── */}
                    <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))", marginBottom: 24 }}>
                        <StatCard label="My Reservations" value={myReservations.length} />
                        <StatCard label="Confirmed"       value={myStats.confirmed.length} accent />
                        <StatCard label="Pending"         value={myStats.pending.length} />
                        <StatCard label="Total Spent"     value={`${myStats.spent}€`} />
                    </div>

                    {/* ── My reservations ── */}
                    <div style={{ margin: "0 0 6px", fontWeight: 800, fontSize: "0.95rem" }}>My reservations</div>

                    {myReservationRows.length === 0 ? (
                        <div className="state" style={{ marginBottom: 24 }}>
                            You have no reservations yet. Book a trip below!
                        </div>
                    ) : (
                        <div className="table-wrapper" style={{ marginBottom: 24 }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Route</th>
                                        <th>Trip date</th>
                                        <th>Reserved on</th>
                                        <th>Seats</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myReservationRows.map(r => (
                                        <tr key={r.id}>
                                            <td>{r.tripLabel}</td>
                                            <td>{r.tripDate ? String(r.tripDate) : "—"}</td>
                                            <td>{r.reservationDate ? String(r.reservationDate) : "—"}</td>
                                            <td>{r.numberOfSeats}</td>
                                            <td>{r.totalPrice}€</td>
                                            <td>
                                                <span className={r.confirmed ? "badge badge-ok" : "badge badge-no"}>
                                                    {r.confirmed ? "Confirmed" : "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ── Find a trip ── */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>Find a trip</span>
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
                            {availableTrips.length} trip{availableTrips.length !== 1 ? "s" : ""} found
                        </span>
                    </div>

                    <div className="toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
                        <input
                            type="search"
                            placeholder="Origin, destination, transport…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                            style={{ minWidth: 200 }}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            From
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ minWidth: 130 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            To
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ minWidth: 130 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700, cursor: "pointer" }}>
                            <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} />
                            Only available
                        </label>
                        {(q || dateFrom || dateTo || !onlyAvailable) && (
                            <button className="btn btn-ghost" onClick={() => {
                                setQ(""); setDateFrom(""); setDateTo(""); setOnlyAvailable(true);
                            }}>Clear</button>
                        )}
                    </div>

                    {availableTrips.length === 0 ? (
                        <div className="state">No trips match the current filters.</div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <Th label="Origin"      col="origin"         active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Destination" col="destination"    active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Date"        col="dateTime"       active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Transport"   col="transportTypes" active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Seats"       col="availableSeats" active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Price"       col="price"          active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {availableTrips.map(t => (
                                        <tr key={t.id}>
                                            <td>{t.origin}</td>
                                            <td>{t.destination}</td>
                                            <td>{t.dateTime ? String(t.dateTime) : "—"}</td>
                                            <td>{t.transportTypes ?? "—"}</td>
                                            <td>{t.availableSeats}</td>
                                            <td>{t.price}€</td>
                                            <td>
                                                <span className={!t.full ? "badge badge-ok" : "badge badge-no"}>
                                                    {!t.full ? "Available" : "Full"}
                                                </span>
                                            </td>
                                            <td>
                                                {!t.full && (
                                                    <button
                                                        className="btn btn-edit"
                                                        style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                                                        onClick={() => navigate(`/reservations/new?tripId=${t.id}`)}
                                                    >
                                                        Book
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function StatCard({ label, value, accent }) {
    return (
        <div className={`stat-card${accent ? " stat-card--accent" : ""}`}>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

function Th({ label, col, active, onClick, arrow }) {
    return (
        <th
            className={`th-sortable${active === col ? " th-active" : ""}`}
            onClick={() => onClick(col)}
        >
            {label}{arrow(col)}
        </th>
    );
}
