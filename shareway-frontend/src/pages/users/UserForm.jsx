import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { createUser, getUser, updateUser } from "../../api/usersApi";
import { t } from "../../i18n/en";

const empty = {
    name: "",
    email: "",
    phone: "",
    registrationDate: "", // "2026-02-07"
    stars: 0,
    verified: false,
};

export default function UserForm({ mode }) {
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState(empty);
    const [status, setStatus] = useState(mode === "edit" ? "loading" : "idle");
    const [error, setError] = useState(null);

    function setField(k, v) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    useEffect(() => {
        if (mode !== "edit") return;

        (async () => {
        try {
            setStatus("loading");
            setError(null);
            const data = await getUser(id);
            setForm({
            name: data.name ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            registrationDate: data.registrationDate ?? "",
            stars: data.stars ?? 0,
            verified: Boolean(data.verified),
            });
            setStatus("idle");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
        })();
    }, [mode, id]);

    async function onSubmit(e) {
        e.preventDefault();
        try {
        setError(null);

        const payload = {
            ...form,
            stars: Number(form.stars),
            verified: Boolean(form.verified),
        };

        if (mode === "create") {
            const created = await createUser(payload);
            nav(`/users/${created.id}`);
        } else {
            const updated = await updateUser(id, payload);
            nav(`/users/${updated.id}`);
        }
        } catch (e2) {
        setError(e2);
        }
    }

    if (status === "loading") return <Loading text="Loading form..." />;
    if (status === "error") return <ErrorBox error={error} />;

    return (
        <div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>
            {mode === "create" ? t.newUser : `${t.edit} User #${id}`}
            </h2>
            <Link to="/users">{t.back}</Link>
        </div>

        {error && <div style={{ marginTop: 12 }}><ErrorBox error={error} /></div>}

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="name" />
            <input value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="email" />
            <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="phone" />
            <input value={form.registrationDate} onChange={(e) => setField("registrationDate", e.target.value)} placeholder="registrationDate (YYYY-MM-DD)" />

            <input type="number" value={form.stars} onChange={(e) => setField("stars", e.target.value)} placeholder="stars" />

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={form.verified} onChange={(e) => setField("verified", e.target.checked)} />
            verified
            </label>

            <button type="submit">
            {mode === "create" ? t.create : t.save}
            </button>
        </form>
        </div>
    );
}