import client from './client';
export async function getClienti(filter) {
    const params = {};
    if (filter)
        params.filter = filter;
    const { data } = await client.get('/v1/clienti', { params });
    return data;
}
export async function getClienteById(id) {
    const { data } = await client.get(`/v1/clienti/${id}`);
    return data;
}
export async function createCliente(payload) {
    const { data } = await client.post('/v1/clienti', payload);
    return data;
}
export async function updateCliente(id, payload) {
    const { data } = await client.put(`/v1/clienti/${id}`, payload);
    return data;
}
export async function deleteCliente(id, hard) {
    const params = {};
    if (hard)
        params.hard = 'true';
    await client.delete(`/v1/clienti/${id}`, { params });
}
export async function getClientiMin() {
    const { data } = await client.get('/v1/clienti/min');
    return data;
}
