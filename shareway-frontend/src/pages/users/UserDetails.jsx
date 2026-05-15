import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import ErrorBox from "../../components/ErrorBox.jsx";
import { deleteUser, getUser } from "../../api/usersApi.js";
import { t } from "../../i18n/en.js";

function Badge({ ok, textTrue = "Yes", textFalse = "No" }) {
    return (
        <span className={`badge ${ok ? "badge-ok" : "badge-no"}`}>
        {ok ? textTrue : textFalse}
        </span>
    );
}

export default function UserDetails() {
    const { id } = useParams();
    const nav = useNavigate();

    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);

    async function load() {
        try {
        setStatus("loading");
        setError(null);
        const data = await getUser(id);
        setItem(data);
        setStatus("success");
        } catch (e) {
        setError(e);
        setStatus("error");
        }
    }

    useEffect(() => { load(); }, [id]);

    async function onDelete() {
        if (!confirm(t.confirmDelete)) return;
        try {
        await deleteUser(id);
        nav("/users");
        } catch (e) {
        setError(e);
        setStatus("error");
        }
    }

    if (status === "loading") return <Loading />;
    if (status === "error") return <ErrorBox error={error} onRetry={load} />;

    return (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>User</h2>
            <div className="actions">
                <Link className="btn btn-edit" to={`/users/${id}/edit`}>{t.edit}</Link>
                <button className="btn btn-delete" onClick={onDelete}>{t.delete}</button>
                <Link className="btn btn-ghost" to="/users">{t.back}</Link>
            </div>
        </div>

        <div className="detail-card" style={{ marginTop: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
            {item.name}
            </div>

            <div className="detail-grid">
            <div className="detail-label">Email</div>
            <div className="detail-value">{item.email ?? "-"}</div>

            <div className="detail-label">Phone</div>
            <div className="detail-value">{item.phone ?? "-"}</div>

            <div className="detail-label">Registration date</div>
            <div className="detail-value">{String(item.registrationDate ?? "")}</div>

            <div className="detail-label">Stars</div>
            <div className="detail-value">{item.stars ?? 0}</div>

            <div className="detail-label">Verified</div>
            <div className="detail-value"><Badge ok={Boolean(item.verified)} /></div>
            </div>
        </div>
        </div>
    );
}