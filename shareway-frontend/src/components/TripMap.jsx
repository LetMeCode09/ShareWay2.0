import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ciudades = {
    zaragoza: [41.6488, -0.8891],
    madrid: [40.4168, -3.7038],
    bilbao: [43.2630, -2.9350],
    santander: [43.4623, -3.8099],
    barcelona: [41.3874, 2.1686],
    valencia: [39.4699, -0.3763],
    sevilla: [37.3891, -5.9845],
    malaga: [36.7213, -4.4214],
};

function normalizarCiudad(ciudad) {
    return ciudad
        ?.trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default function TripMap({ origin, destination }) {
    const originKey = normalizarCiudad(origin);
    const destinationKey = normalizarCiudad(destination);

    const originPosition = ciudades[originKey];
    const destinationPosition = ciudades[destinationKey];

    if (!originPosition || !destinationPosition) {
        return (
            <p>
                No hay coordenadas para este viaje: {origin} → {destination}
            </p>
        );
    }

    return (
        <MapContainer
            center={originPosition}
            zoom={8}
            style={{ height: "400px", width: "100%", borderRadius: "12px" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={originPosition}>
                <Popup>Origen: {origin}</Popup>
            </Marker>

            <Marker position={destinationPosition}>
                <Popup>Destino: {destination}</Popup>
            </Marker>

            <Polyline positions={[originPosition, destinationPosition]} />
        </MapContainer>
    );
}