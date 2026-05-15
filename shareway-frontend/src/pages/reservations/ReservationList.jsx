import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getReservations } from "../../api/reservationsApi";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import SearchSortBar from "../../components/SearchSortBar";
import { t } from "../../i18n/en";

export default function ReservationsList() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const [q, setQ] = useState("");
    const [sortBy, setSortBy] = useState("reservationDate");
    const [order, setOrder] = useState("asc");

    async function load() {
        try {
        setStatus("loading");
        setError(null);
        const data = await getReservations();
        setItems(Array.isArray(data) ? data : []);
        setStatus("success");
        } catch (e) {
        setError(e);
        setStatus("error");
        }
    }

    useEffect(() => { load(); }, []);

    const filteredSorted = useMemo(() => {
        const text = q.trim().toLowerCase();
        let list = [...items];

        if (text) {
        list = list.filter((r) => {
            const hay = [r.comment, String(r.totalPrice), String(r.numberOfSeats)]
            .filter(Boolean).join(" ").toLowerCase();
            return hay.includes(text);
        });
        }

        list.sort((a, b) => {
        const va = a?.[sortBy] ?? "";
        const vb = b?.[sortBy] ?? "";
        if (va < vb) return order === "asc" ? -1 : 1;
        if (va > vb) return order === "asc" ? 1 : -1;
        return 0;
        });

        return list;
    }, [items, q, sortBy, order]);

    return (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>{t.navReservations}</h2>
            <Link to="/reservations/new">{t.newReservation}</Link>
        </div>

        <SearchSortBar
            q={q} setQ={setQ}
            sortBy={sortBy} setSortBy={setSortBy}
            order={order} setOrder={setOrder}
            sortOptions={[
            { value: "reservationDate", label: "reservationDate" },
            { value: "totalPrice", label: "totalPrice" },
            { value: "numberOfSeats", label: "numberOfSeats" },
            ]}
            onRefresh={load}
        />

        {status === "loading" && <Loading />}
        {status === "error" && <ErrorBox error={error} onRetry={load} />}

        {status === "success" && filteredSorted.length === 0 && (
            <div className="state">{t.empty}</div>
        )}

        {status === "success" && filteredSorted.length > 0 && (
            <div className="grid">
            {filteredSorted.map((r) => (
                <Link key={r.id} to={`/reservations/${r.id}`} className="card">
                    <div className="card-title">Reservation of: {r.user?.name ?? "Unknown"}</div>
                    <div className="card-sub">Date: {String(r.reservationDate)}</div>
                    <div className="card-sub">
                        Seats: {r.numberOfSeats} · Total: {r.totalPrice}€ · Confirmed: {String(r.confirmed)}
                    </div>
                </Link>
            ))}
            </div>
        )}
        </div>
    );
}