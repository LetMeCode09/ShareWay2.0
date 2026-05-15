import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import SearchSortBar from "../../components/SearchSortBar";
import { t } from "../../i18n/en";
import { getUsers, searchUsersByName } from "../../api/usersApi";

export default function UsersList() {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    const [q, setQ] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");

    async function loadAll() {
        try {
        setStatus("loading");
        setError(null);
        const data = await getUsers();
        setItems(Array.isArray(data) ? data : []);
        setStatus("success");
        } catch (e) {
        setError(e);
        setStatus("error");
        }
    }

    async function loadSearch(name) {
        try {
        setStatus("loading");
        setError(null);
        const data = await searchUsersByName(name);
        setItems(Array.isArray(data) ? data : []);
        setStatus("success");
        } catch (e) {
        setError(e);
        setStatus("error");
        }
    }

    useEffect(() => { loadAll(); }, []);

    useEffect(() => {
        const name = q.trim();
        const timer = setTimeout(() => {
        if (!name) loadAll();
        else loadSearch(name);
        }, 300);
        return () => clearTimeout(timer);
    }, [q]);

    const sorted = useMemo(() => {
        let list = [...items];
        list.sort((a, b) => {
        const va = a?.[sortBy] ?? "";
        const vb = b?.[sortBy] ?? "";
        if (va < vb) return order === "asc" ? -1 : 1;
        if (va > vb) return order === "asc" ? 1 : -1;
        return 0;
        });
        return list;
    }, [items, sortBy, order]);

    return (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>{t.navUsers}</h2>
            <Link to="/users/new">{t.newUser}</Link>
        </div>

        <SearchSortBar
            q={q} setQ={setQ}
            sortBy={sortBy} setSortBy={setSortBy}
            order={order} setOrder={setOrder}
            sortOptions={[
            { value: "name", label: "name" },
            { value: "email", label: "email" },
            { value: "stars", label: "stars" },
            ]}
            onRefresh={loadAll}
        />

        {status === "loading" && <Loading />}
        {status === "error" && <ErrorBox error={error} onRetry={loadAll} />}

        {status === "success" && sorted.length === 0 && (
            <div className="state">{t.empty}</div>
        )}

        {status === "success" && sorted.length > 0 && (
            <div className="grid">
            {sorted.map((u) => (
                <Link key={u.id} to={`/users/${u.id}`} className="card">
                    <div className="card-title">{u.name}</div>
                    <div className="card-sub">{u.email}</div>
                    <div className="card-sub">
                        Stars: {u.stars} · Verified: {String(u.verified)}
                    </div>
                </Link>
            ))}
            </div>
        )}
        </div>
    );
}