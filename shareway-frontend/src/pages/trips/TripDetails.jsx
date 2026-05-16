import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading.jsx";
import ErrorBox from "../../components/ErrorBox.jsx";
import { deleteTrip, getTrip } from "../../api/tripsApi.js";
import { t } from "../../i18n/en.js";
import TripMap from "../../components/TripMap.jsx";

function Badge({ ok, textTrue = "Yes", textFalse = "No" }) {
    return (
        <span className={`badge ${ok ? "badge-ok" : "badge-no"}`}>
            {ok ? textTrue : textFalse}
        </span>
    );
}

export default function TripDetails() {
    const { id } = useParams();
    const nav = useNavigate();

    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState(null);

    async function load() {
        try {
            setStatus("loading");
            setError(null);
            const data = await getTrip(id);
            setItem(data);
            setStatus("success");
        } catch (e) {
            setError(e);
            setStatus("error");
        }
    }

    useEffect(() => {
        load();
    }, [id]);

    async function onDelete() {
        if (!confirm(t.confirmDelete)) return;

        try {
            await deleteTrip(id);
            nav("/trips");
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
                <h2 style={{ margin: 0 }}>Trip</h2>

                <div className="actions">
                    <Link className="btn btn-edit" to={`/trips/${id}/edit`}>{t.edit}</Link>
                    <button className="btn btn-delete" onClick={onDelete}>{t.delete}</button>
                    <Link className="btn btn-ghost" to="/trips">{t.back}</Link>
                </div>
            </div>

            <div className="detail-card" style={{ marginTop: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {item.origin} → {item.destination}
                </div>

                <div className="detail-grid">
                    <div className="detail-label">Date & time</div>
                    <div className="detail-value">{String(item.dateTime ?? "")}</div>

                    <div className="detail-label">Transport</div>
                    <div className="detail-value">{item.transportTypes ?? "-"}</div>

                    <div className="detail-label">Available seats</div>
                    <div className="detail-value">{item.availableSeats}</div>

                    <div className="detail-label">Price</div>
                    <div className="detail-value">{item.price} €</div>

                    <div className="detail-label">Full</div>
                    <div className="detail-value">
                        <Badge ok={item.full} />
                    </div>
                </div>
            </div>

            <div className="detail-card" style={{ marginTop: 20 }}>
                <h3 style={{ marginTop: 0 }}>Trip map</h3>
                <TripMap origin={item.origin} destination={item.destination} />
            </div>
        </div>
    );
}