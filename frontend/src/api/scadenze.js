import client from './client';
export async function getScadenze(filters) {
    const params = {};
    if (filters?.cliente_id)
        params.cliente_id = filters.cliente_id;
    if (filters?.utente_id)
        params.utente_id = filters.utente_id;
    if (filters?.filter)
        params.filter = filters.filter;
    if (filters?.date_start)
        params.date_start = filters.date_start;
    if (filters?.date_end)
        params.date_end = filters.date_end;
    const { data } = await client.get('/v1/scadenze', { params });
    return data.data;
}
export async function getScadenzaById(id) {
    const { data } = await client.get(`/v1/scadenze/${id}`);
    return data.data;
}
export async function createScadenza(payload) {
    const { data } = await client.post('/v1/scadenze', payload);
    return data.data;
}
export async function updateScadenza(id, payload) {
    const { data } = await client.put(`/v1/scadenze/${id}`, payload);
    return data.data;
}
export async function deleteScadenza(id, hard) {
    const params = {};
    if (hard)
        params.hard = 'true';
    await client.delete(`/v1/scadenze/${id}`, { params });
}
export async function exportScadenzasPDF(filters) {
    const params = {};
    if (filters?.cliente_id)
        params.cliente_id = filters.cliente_id;
    if (filters?.utente_id)
        params.utente_id = filters.utente_id;
    if (filters?.filter)
        params.filter = filters.filter;
    if (filters?.date_start)
        params.date_start = filters.date_start;
    if (filters?.date_end)
        params.date_end = filters.date_end;
    const response = await client.get('/v1/scadenze/export/pdf', {
        params,
        responseType: 'blob',
    });
    return response.data;
}
