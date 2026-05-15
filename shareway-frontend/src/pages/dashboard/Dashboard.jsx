import { useEffect, useMemo, useState } from "react";
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
    const [trips, setTrips]             = useState([]);
    const [users, setUsers]             = useState([]);
    const [reservations, setReservations] = useState([]);
    const [status, setStatus]           = useState("idle");
    const [error, setError]             = useState(null);

    const [q, setQ]               = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo]     = useState("");
    const [onlyConfirmed, setOnlyConfirmed] = useState(false);

    const [sortCol, setSortCol] = useState("reservationDate");
    const [sortDir, setSortDir] = useState("desc");

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
        const confirmed  = reservations.filter(r => r.confirmed);
        const totalPrice = reservations.reduce((acc, r) => acc + (r.totalPrice ?? 0), 0);
        return {
            totalTrips:            trips.length,
            totalUsers:            users.length,
            totalReservations:     reservations.length,
            confirmedReservations: confirmed.length,
            avgPrice: reservations.length ? Math.round(totalPrice / reservations.length) : 0,
        };
    }, [trips, users, reservations]);

    const tableData = useMemo(() => {
        const text = q.trim().toLowerCase();
        let list = reservations.map(r => ({
            ...r,
            userName:  r.user?.name  ?? `User #${r.user?.id  ?? "?"}`,
            tripLabel: r.trip
                ? `${r.trip.origin ?? "?"} → ${r.trip.destination ?? "?"}`
                : `Trip #${r.tripId ?? "?"}`,
        }));

        if (text) {
            list = list.filter(r =>
                [r.userName, r.tripLabel, String(r.totalPrice), String(r.numberOfSeats), r.comment]
                    .filter(Boolean).join(" ").toLowerCase().includes(text)
            );
        }
        if (dateFrom) list = list.filter(r => r.reservationDate && String(r.reservationDate) >= dateFrom);
        if (dateTo)   list = list.filter(r => r.reservationDate && String(r.reservationDate) <= dateTo);
        if (onlyConfirmed) list = list.filter(r => r.confirmed);

        list.sort((a, b) => {
            const va = a[sortCol] ?? "";
            const vb = b[sortCol] ?? "";
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1  : -1;
            return 0;
        });
        return list;
    }, [reservations, q, dateFrom, dateTo, onlyConfirmed, sortCol, sortDir]);

    function toggleSort(col) {
        if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortCol(col); setSortDir("asc"); }
    }
    const sortArrow = col => sortCol !== col ? " ↕" : sortDir === "asc" ? " ↑" : " ↓";

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div>
                    <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>Global overview — trips, users and reservations</p>
                </div>
                <button onClick={load} className="btn btn-ghost">Refresh</button>
            </div>

            {status === "loading" && <Loading text="Loading dashboard..." />}
            {status === "error"   && <ErrorBox error={error} onRetry={load} />}

            {status === "success" && (
                <>
                    <div className="stat-grid">
                        <StatCard label="Trips"        value={stats.totalTrips} />
                        <StatCard label="Users"        value={stats.totalUsers} />
                        <StatCard label="Reservations" value={stats.totalReservations} />
                        <StatCard label="Confirmed"    value={stats.confirmedReservations} accent />
                        <StatCard label="Avg Price"    value={`${stats.avgPrice}€`} />
                    </div>

                    <div className="toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
                        <input
                            type="search"
                            placeholder="Search user, trip, price…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            From
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ minWidth: 140 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            To
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ minWidth: 140 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700, cursor: "pointer" }}>
                            <input type="checkbox" checked={onlyConfirmed} onChange={e => setOnlyConfirmed(e.target.checked)} />
                            Only confirmed
                        </label>
                        {(q || dateFrom || dateTo || onlyConfirmed) && (
                            <button className="btn btn-ghost" onClick={() => {
                                setQ(""); setDateFrom(""); setDateTo(""); setOnlyConfirmed(false);
                            }}>Clear</button>
                        )}
                    </div>

                    {tableData.length === 0 ? (
                        <div className="state">No reservations match the current filters.</div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <Th label="ID"     col="id"              active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="User"   col="userName"        active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Trip"   col="tripLabel"       active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Date"   col="reservationDate" active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Seats"  col="numberOfSeats"   active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Price"  col="totalPrice"      active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Status" col="confirmed"       active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map(r => (
                                        <tr key={r.id}>
                                            <td>#{r.id}</td>
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
                </>
            )}
        </div>
    );
}

// ── USER ───────────────────────────────────────────────────────────────────

function UserDashboard() {
    const [trips, setTrips] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError]   = useState(null);

    const [q, setQ]               = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo]     = useState("");
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    const [sortCol, setSortCol] = useState("dateTime");
    const [sortDir, setSortDir] = useState("asc");

    async function load() {
        try {
            setStatus("loading");
            setError(null);
            const t = await getTrips();
            setTrips(Array.isArray(t) ? t : []);
            setStatus("success");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
    }

    useEffect(() => { load(); }, []);

    const today = new Date().toISOString().split("T")[0];

    const stats = useMemo(() => {
        const available = trips.filter(t => !t.full);
        const upcoming  = trips.filter(t => t.dateTime && String(t.dateTime) >= today);
        const totalPrice = trips.reduce((acc, t) => acc + (t.price ?? 0), 0);
        return {
            totalTrips: trips.length,
            available:  available.length,
            upcoming:   upcoming.length,
            avgPrice:   trips.length ? Math.round(totalPrice / trips.length) : 0,
        };
    }, [trips, today]);

    const tableData = useMemo(() => {
        const text = q.trim().toLowerCase();
        let list = [...trips];

        if (text) {
            list = list.filter(t =>
                [t.origin, t.destination, t.transportTypes, String(t.price)]
                    .filter(Boolean).join(" ").toLowerCase().includes(text)
            );
        }
        if (dateFrom) list = list.filter(t => t.dateTime && String(t.dateTime) >= dateFrom);
        if (dateTo)   list = list.filter(t => t.dateTime && String(t.dateTime) <= dateTo);
        if (onlyAvailable) list = list.filter(t => !t.full);

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
                    <h2 style={{ margin: 0 }}>My Dashboard</h2>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>Browse available trips and plan your next ride</p>
                </div>
                <button onClick={load} className="btn btn-ghost">Refresh</button>
            </div>

            {status === "loading" && <Loading text="Loading trips..." />}
            {status === "error"   && <ErrorBox error={error} onRetry={load} />}

            {status === "success" && (
                <>
                    <div className="stat-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
                        <StatCard label="Total Trips" value={stats.totalTrips} />
                        <StatCard label="Available"   value={stats.available}  accent />
                        <StatCard label="Upcoming"    value={stats.upcoming} />
                        <StatCard label="Avg Price"   value={`${stats.avgPrice}€`} />
                    </div>

                    <div className="toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
                        <input
                            type="search"
                            placeholder="Search origin, destination, transport…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            From
                            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ minWidth: 140 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            To
                            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ minWidth: 140 }} />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700, cursor: "pointer" }}>
                            <input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} />
                            Only available
                        </label>
                        {(q || dateFrom || dateTo || onlyAvailable) && (
                            <button className="btn btn-ghost" onClick={() => {
                                setQ(""); setDateFrom(""); setDateTo(""); setOnlyAvailable(false);
                            }}>Clear</button>
                        )}
                    </div>

                    {tableData.length === 0 ? (
                        <div className="state">No trips match the current filters.</div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <Th label="ID"          col="id"             active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Origin"      col="origin"         active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Destination" col="destination"    active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Date"        col="dateTime"       active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Transport"   col="transportTypes" active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Seats"       col="availableSeats" active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Price"       col="price"          active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                        <Th label="Status"      col="full"           active={sortCol} onClick={toggleSort} arrow={sortArrow} />
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map(t => (
                                        <tr key={t.id}>
                                            <td>#{t.id}</td>
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
