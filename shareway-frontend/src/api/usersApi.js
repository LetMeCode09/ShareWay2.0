import { http } from "./http";

export async function getUsers() {
    const { data } = await http.get("/users");
    return data;
}

export async function getUser(id) {
    const { data } = await http.get(`/users/${id}`);
    return data;
}

export async function searchUsersByName(name) {
    const { data } = await http.get("/users/search", { params: { name } });
    return data;
}

export async function createUser(payload) {
    const { data } = await http.post("/users", payload);
    return data;
}

export async function updateUser(id, payload) {
    const { data } = await http.put(`/users/${id}`, payload);
    return data;
}

export async function deleteUser(id) {
    await http.delete(`/users/${id}`);
}