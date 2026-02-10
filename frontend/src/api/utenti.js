import client from './client';
export async function getUtenti(filter) {
    const params = {};
    if (filter)
        params.filter = filter;
    const { data } = await client.get('/v1/utenti', { params });
    return data.data;
}
export async function getUtenteById(id) {
    const { data } = await client.get(`/v1/utenti/${id}`);
    return data.data;
}
export async function createUtente(payload) {
    const { data } = await client.post('/v1/utenti', payload);
    return data.data;
}
export async function updateUtente(id, payload) {
    const { data } = await client.put(`/v1/utenti/${id}`, payload);
    return data.data;
}
export async function deleteUtente(id, hard) {
    const params = {};
    if (hard)
        params.hard = 'true';
    await client.delete(`/v1/utenti/${id}`, { params });
}
export async function getUtentiMin() {
    const { data } = await client.get('/v1/utenti/min');
    return data.data;
}
