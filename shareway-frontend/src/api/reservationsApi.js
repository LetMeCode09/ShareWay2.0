import { http } from "./http";

export async function getReservations() {
    const { data } = await http.get("/reservations");
    return data;
}

export async function getReservation(id) {
    const { data } = await http.get(`/reservations/${id}`);
    return data;
}

export async function createReservation(payload) {
    const { data } = await http.post("/reservations", payload);
    return data;
}

export async function updateReservation(id, payload) {
    const { data } = await http.put(`/reservations/${id}`, payload);
    return data;
}

export async function deleteReservation(id) {
    await http.delete(`/reservations/${id}`);
}