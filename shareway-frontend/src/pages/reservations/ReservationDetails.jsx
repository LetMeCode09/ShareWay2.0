import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import ErrorBox from "../../components/ErrorBox.jsx";
import { deleteReservation, getReservation } from "../../api/reservationsApi.js";
import { getTrip } from "../../api/tripsApi.js";
import { t } from "../../i18n/en.js";

function Badge({ ok, textTrue = "Yes", textFalse = "No" }) {
    return (
        <span className={`badge ${ok ? "badge-ok" : "badge-no"}`}>
            {ok ? textTrue : textFalse}
        </span>
    );
}

export default function ReservationDetails() {
    const { id } = useParams();
    const nav = useNavigate();

    const [item, setItem] = useState(null);
    const [trip, setTrip] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);

    async function load() {
        try {
            setStatus("loading");
            setError(null);

            // 1️⃣ cargar reserva
            const data = await getReservation(id);
            setItem(data);

            // 2️⃣ sacar tripId (puede venir de varias formas)
            const tripId = data?.trip?.id ?? data?.tripId ?? data?.trip;

            // 3️⃣ cargar trip para obtener transportTypes
            if (tripId) {
                const tripData = await getTrip(tripId);
                setTrip(tripData);
            } else {
                setTrip(null);
            }

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
            await deleteReservation(id);
            nav("/reservations");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
    }

    if (status === "loading") return <Loading />;
    if (status === "error") return <ErrorBox error={error} onRetry={load} />;

    const userName = item?.user?.name ?? "—";
    const userId = item?.user?.id ?? null;

    const tripId = item?.trip?.id ?? item?.tripId ?? item?.trip ?? null;

    // si transportTypes es array → join bonito
    const transportTypes = Array.isArray(trip?.transportTypes)
        ? trip.transportTypes.join(", ")
        : (trip?.transportTypes ?? "—");

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <h2 style={{ margin: 0 }}>Reservation</h2>
                <div className="actions">
                    <Link className="btn btn-edit" to={`/reservations/${id}/edit`}>{t.edit}</Link>
                    <button className="btn btn-delete" onClick={onDelete}>{t.delete}</button>
                    <Link className="btn btn-ghost" to="/reservations">{t.back}</Link>
                </div>
            </div>

            <div className="detail-card" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Comentario: {item.comment ? item.comment : "Reservation details"}</div>

                <div className="detail-grid">
                    <div className="detail-label">Reservation date</div>
                    <div className="detail-value">{String(item.reservationDate ?? "")}</div>

                    <div className="detail-label">Seats</div>
                    <div className="detail-value">{item.numberOfSeats}</div>

                    <div className="detail-label">Total price</div>
                    <div className="detail-value">{item.totalPrice} €</div>

                    <div className="detail-label">Confirmed</div>
                    <div className="detail-value">
                        <Badge ok={Boolean(item.confirmed)} />
                    </div>

                    <div className="detail-label">User</div>
                    <div className="detail-value">
                        {userId ? <Link to={`/users/${userId}`}>{userName}</Link> : "—"}
                    </div>

                    <div className="detail-label">Trip</div>
                    <div className="detail-value">
                        {tripId ? <Link to={`/trips/${tripId}`}>{transportTypes}</Link> : "—"}
                    </div>
                </div>
            </div>
        </div>
    );
}