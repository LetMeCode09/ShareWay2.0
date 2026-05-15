import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import ErrorBox from "../../components/ErrorBox";
import { createReservation, getReservation, updateReservation } from "../../api/reservationsApi";
import { getUsers } from "../../api/usersApi";
import { getTrips } from "../../api/tripsApi";
import { t } from "../../i18n/en";

const empty = {
    numberOfSeats: 1,
    reservationDate: "",
    confirmed: false,
    comment: "",
    totalPrice: 0,
    userId: "",
    tripId: "",
};

export default function ReservationForm({ mode }) {
    const { id } = useParams();
    const nav = useNavigate();

    const [form, setForm] = useState(empty);
    const [status, setStatus] = useState(mode === "edit" ? "loading" : "idle");
    const [error, setError] = useState(null);

    const [users, setUsers] = useState([]);
    const [trips, setTrips] = useState([]);

    function setField(k, v) {
        setForm((p) => ({ ...p, [k]: v }));
    }

    // Cargar combos
    useEffect(() => {
        (async () => {
        try {
            const [u, tr] = await Promise.all([getUsers(), getTrips()]);
            setUsers(Array.isArray(u) ? u : []);
            setTrips(Array.isArray(tr) ? tr : []);
        } catch (e) {
            // No bloqueamos el form, pero mostramos error si quieres
            setError(e);
        }
        })();
    }, []);

    // Cargar reserva en edit
    useEffect(() => {
        if (mode !== "edit") return;

        (async () => {
        try {
            setStatus("loading");
            setError(null);

            const data = await getReservation(id);

            const userId = String(data.user?.id ?? data.userId ?? data.user ?? "");
            const tripId = String(data.trip?.id ?? data.tripId ?? data.trip ?? "");

            setForm({
            numberOfSeats: data.numberOfSeats ?? 1,
            reservationDate: data.reservationDate ?? "",
            confirmed: Boolean(data.confirmed),
            comment: data.comment ?? "",
            totalPrice: data.totalPrice ?? 0,
            userId,
            tripId,
            });

            setStatus("idle");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
        })();
    }, [mode, id]);

    // Helpers para mostrar texto bonito en los selects
    const userOptions = useMemo(() => {
        return users.map((u) => ({
        id: String(u.id),
        label: `${u.name ?? "Unnamed"}`,
        }));
    }, [users]);

    const tripOptions = useMemo(() => {
        return trips.map((tr) => {
            const origin = tr.origin ?? tr.from ?? tr.startCity ?? tr.departure ?? "—";
            const destination = tr.destination ?? tr.to ?? tr.endCity ?? tr.arrival ?? "—";
            const label = `${origin} → ${destination}`;
            return { id: String(tr.id), label };
        });
    }, [trips]);

    async function onSubmit(e) {
        e.preventDefault();

        try {
        setError(null);

        if (!form.userId || !form.tripId) {
            throw new Error("User and Trip are required");
        }

        const userIdNum = Number(form.userId);
        const tripIdNum = Number(form.tripId);

        if (!Number.isFinite(userIdNum) || userIdNum <= 0) throw new Error("Invalid user");
        if (!Number.isFinite(tripIdNum) || tripIdNum <= 0) throw new Error("Invalid trip");

        const payload = {
            numberOfSeats: Number(form.numberOfSeats),
            reservationDate: form.reservationDate,
            confirmed: Boolean(form.confirmed),
            comment: form.comment,
            totalPrice: Number(form.totalPrice),
            user: { id: userIdNum },
            trip: { id: tripIdNum },
        };

        if (mode === "create") {
            const created = await createReservation(payload);
            nav(`/reservations/${created.id}`);
        } else {
            const updated = await updateReservation(id, payload);
            nav(`/reservations/${updated.id}`);
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
            {mode === "create" ? t.newReservation : `${t.edit} Reservation #${id}`}
            </h2>
            <Link to="/reservations">{t.back}</Link>
        </div>

        {error && (
            <div style={{ marginTop: 12 }}>
            <ErrorBox error={error} />
            </div>
        )}

        <form onSubmit={onSubmit} className="grid" style={{ marginTop: 12 }}>
            <input
            type="number"
            value={form.numberOfSeats}
            onChange={(e) => setField("numberOfSeats", e.target.value)}
            placeholder="numberOfSeats"
            min={1}
            />

            <input
            value={form.reservationDate}
            onChange={(e) => setField("reservationDate", e.target.value)}
            placeholder="reservationDate (YYYY-MM-DDTHH:mm)"
            />

            <input
            value={form.comment}
            onChange={(e) => setField("comment", e.target.value)}
            placeholder="comment"
            />

            <input
            type="number"
            value={form.totalPrice}
            onChange={(e) => setField("totalPrice", e.target.value)}
            placeholder="totalPrice"
            min={0}
            />

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
                type="checkbox"
                checked={form.confirmed}
                onChange={(e) => setField("confirmed", e.target.checked)}
            />
            confirmed
            </label>

            {/* ✅ SELECT USER */}
            <select value={form.userId} onChange={(e) => setField("userId", e.target.value)}>
            <option value="">Select user…</option>
            {userOptions.map((u) => (
                <option key={u.id} value={u.id}>
                {u.label}
                </option>
            ))}
            </select>

            {/* ✅ SELECT TRIP */}
            <select value={form.tripId} onChange={(e) => setField("tripId", e.target.value)}>
            <option value="">Select trip…</option>
            {tripOptions.map((tr) => (
                <option key={tr.id} value={tr.id}>
                {tr.label}
                </option>
            ))}
            </select>

            <button type="submit">
            {mode === "create" ? t.create : t.save}
            </button>
        </form>
        </div>
    );
}