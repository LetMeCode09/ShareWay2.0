import { useEffect, useMemo, useState } from "react";
import { getTrips } from "../../api/tripsApi";
import { getUsers } from "../../api/usersApi";
import { getReservations } from "../../api/reservationsApi";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";

export default function Dashboard() {
    const [trips, setTrips]             = useState([]);
    const [users, setUsers]             = useState([]);
    const [reservations, setReservations] = useState([]);
    const [status, setStatus]           = useState("idle");
    const [error, setError]             = useState(null);

    // Filters
    const [q, setQ]               = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo]     = useState("");
    const [onlyConfirmed, setOnlyConfirmed] = useState(false);

    // Table sort
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

    // Stats
    const stats = useMemo(() => {
        const confirmed = reservations.filter(r => r.confirmed);
        const totalPrice = reservations.reduce((acc, r) => acc + (r.totalPrice ?? 0), 0);
        return {
            totalTrips:           trips.length,
            totalUsers:           users.length,
            totalReservations:    reservations.length,
            confirmedReservations: confirmed.length,
            avgPrice: reservations.length
                ? Math.round(totalPrice / reservations.length)
                : 0,
        };
    }, [trips, users, reservations]);

    // Filtered + sorted table
    const tableData = useMemo(() => {
        const text = q.trim().toLowerCase();

        let list = reservations.map(r => ({
            ...r,
            userName: r.user?.name ?? `User #${r.user?.id ?? "?"}`,
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

        if (dateFrom) {
            list = list.filter(r => r.reservationDate && r.reservationDate >= dateFrom);
        }
        if (dateTo) {
            list = list.filter(r => r.reservationDate && r.reservationDate <= dateTo);
        }
        if (onlyConfirmed) {
            list = list.filter(r => r.confirmed);
        }

        list.sort((a, b) => {
            const va = a[sortCol] ?? "";
            const vb = b[sortCol] ?? "";
            if (va < vb) return sortDir === "asc" ? -1 : 1;
            if (va > vb) return sortDir === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [reservations, q, dateFrom, dateTo, onlyConfirmed, sortCol, sortDir]);

    function toggleSort(col) {
        if (sortCol === col) {
            setSortDir(d => d === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir("asc");
        }
    }

    function sortArrow(col) {
        if (sortCol !== col) return " ↕";
        return sortDir === "asc" ? " ↑" : " ↓";
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <h2 style={{ margin: 0 }}>Dashboard</h2>
                <button onClick={load} className="btn btn-ghost">Refresh</button>
            </div>

            {status === "loading" && <Loading text="Loading dashboard..." />}
            {status === "error"   && <ErrorBox error={error} onRetry={load} />}

            {status === "success" && (
                <>
                    {/* ── Stats cards ── */}
                    <div className="stat-grid">
                        <StatCard label="Trips"         value={stats.totalTrips} />
                        <StatCard label="Users"         value={stats.totalUsers} />
                        <StatCard label="Reservations"  value={stats.totalReservations} />
                        <StatCard label="Confirmed"     value={stats.confirmedReservations} accent />
                        <StatCard label="Avg Price"     value={`${stats.avgPrice}€`} />
                    </div>

                    {/* ── Filters ── */}
                    <div className="toolbar" style={{ flexWrap: "wrap", gap: 10 }}>
                        <input
                            type="search"
                            placeholder="Search user, trip, price…"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            From
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                style={{ minWidth: 140 }}
                            />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700 }}>
                            To
                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                style={{ minWidth: 140 }}
                            />
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontWeight: 700, cursor: "pointer" }}>
                            <input
                                type="checkbox"
                                checked={onlyConfirmed}
                                onChange={e => setOnlyConfirmed(e.target.checked)}
                            />
                            Only confirmed
                        </label>
                        {(q || dateFrom || dateTo || onlyConfirmed) && (
                            <button className="btn btn-ghost" onClick={() => {
                                setQ(""); setDateFrom(""); setDateTo(""); setOnlyConfirmed(false);
                            }}>Clear</button>
                        )}
                    </div>

                    {/* ── Table ── */}
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
