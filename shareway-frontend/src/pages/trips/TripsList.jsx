import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getTrips } from "../../api/tripsApi";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import SearchSortBar from "../../components/SearchSortBar";
import { t } from "../../i18n/en";

export default function TripsList() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const [q, setQ] = useState("");
    const [sortBy, setSortBy] = useState("dateTime");
    const [order, setOrder] = useState("asc");

    async function load() {
        try {
        setStatus("loading");
        setError(null);
        const data = await getTrips();
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
        list = list.filter((x) => {
            const hay = [x.origin, x.destination, x.transportTypes]
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
            <h2 style={{ margin: 0 }}>{t.navTrips}</h2>
            <Link to="/trips/new">{t.newTrip}</Link>
        </div>

        <SearchSortBar
            q={q} setQ={setQ}
            sortBy={sortBy} setSortBy={setSortBy}
            order={order} setOrder={setOrder}
            sortOptions={[
            { value: "dateTime", label: "dateTime" },
            { value: "price", label: "price" },
            { value: "availableSeats", label: "availableSeats" },
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
            {filteredSorted.map((x) => (
                <Link key={x.id} to={`/trips/${x.id}`} className="card">
                    <div className="card-title">
                    {x.origin} → {x.destination}
                    </div>

                    <div className="card-sub">
                    Date: {String(x.dateTime)}
                    </div>

                    <div className="card-sub">
                    Seats: {x.availableSeats} · Price: {x.price}€ · Full: {String(x.full)}
                    </div>
                </Link>
            ))}
            </div>
        )}
        </div>
    );
}