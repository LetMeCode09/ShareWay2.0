import { http } from "./http";

export async function getTrips() {
    const { data } = await http.get("/trips");
    return data;
}

export async function getTrip(id) {
    const { data } = await http.get(`/trips/${id}`);
    return data;
}

export async function createTrip(payload) {
    const { data } = await http.post("/trips", payload);
    return data;
}

export async function updateTrip(id, payload) {
    const { data } = await http.put(`/trips/${id}`, payload);
    return data;
}

export async function deleteTrip(id) {
    await http.delete(`/trips/${id}`);
}