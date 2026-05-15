import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { createTrip, getTrip, updateTrip } from "../../api/tripsApi";
import { t } from "../../i18n/en";

const empty = {
    origin: "",
    destination: "",
    dateTime: "",       // "2026-02-07T10:30"
    transportTypes: "",
    availableSeats: 1,
    price: 0,
    full: false,
};

export default function TripForm({ mode }) {
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
            const data = await getTrip(id);
            setForm({
            origin: data.origin ?? "",
            destination: data.destination ?? "",
            dateTime: data.dateTime ?? "",
            transportTypes: data.transportTypes ?? "",
            availableSeats: data.availableSeats ?? 1,
            price: data.price ?? 0,
            full: Boolean(data.full),
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
            availableSeats: Number(form.availableSeats),
            price: Number(form.price),
            full: Boolean(form.full),
        };

        if (mode === "create") {
            const created = await createTrip(payload);
            nav(`/trips/${created.id}`);
        } else {
            const updated = await updateTrip(id, payload);
            nav(`/trips/${updated.id}`);
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
            {mode === "create" ? t.newTrip : `${t.edit} Trip #${id}`}
            </h2>
            <Link to="/trips">{t.back}</Link>
        </div>

        {error && <div style={{ marginTop: 12 }}><ErrorBox error={error} /></div>}

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
            <input value={form.origin} onChange={(e) => setField("origin", e.target.value)} placeholder="origin" />
            <input value={form.destination} onChange={(e) => setField("destination", e.target.value)} placeholder="destination" />
            <input value={form.dateTime} onChange={(e) => setField("dateTime", e.target.value)} placeholder="dateTime (YYYY-MM-DDTHH:mm)" />
            <input value={form.transportTypes} onChange={(e) => setField("transportTypes", e.target.value)} placeholder="transportTypes" />

            <input type="number" value={form.availableSeats} onChange={(e) => setField("availableSeats", e.target.value)} placeholder="availableSeats" />
            <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} placeholder="price" />

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={form.full} onChange={(e) => setField("full", e.target.checked)} />
            full
            </label>

            <button type="submit">
            {mode === "create" ? t.create : t.save}
            </button>
        </form>
        </div>
    );
}