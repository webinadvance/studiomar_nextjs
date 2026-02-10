import { prisma } from '../utils/prisma';
import { calculateRecurringDate } from '../utils/calculateRecurringDate';
import { AppError } from '../middleware/errorHandler';

interface ScadenzeUtente {
  id: number;
  scadenza_id: number;
  utente_id: number;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

interface ScadenzeClienti {
  id: number;
  scadenza_id: number;
  cliente_id: number;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

interface ScadenzeWithRelations {
  id: number;
  name: string;
  rec: number;
  date: string | null;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
  calculated_date?: string;
  scadenze_utenti?: ScadenzeUtente[];
  scadenze_clienti?: ScadenzeClienti[];
  utenti_names?: string | null;
  clienti_names?: string | null;
}

interface ScadenzeCreateRequest {
  name: string;
  rec?: number;
  date?: string;
  utente_ids?: number[];
  cliente_ids?: number[];
}

interface ScadenzeUpdateRequest {
  name?: string;
  rec?: number;
  date?: string;
  utente_ids?: number[];
  cliente_ids?: number[];
}

// Helper: attach calculated_date to a scadenza record
function withCalculatedDate(scadenza: any) {
  const calculatedDate = calculateRecurringDate(
    scadenza.date ? new Date(scadenza.date) : null,
    scadenza.rec
  );
  return {
    ...scadenza,
    calculated_date: calculatedDate ? calculatedDate.toISOString() : null,
  };
}

// Helper: attach aggregated names (comma-separated) for utenti and clienti
function withAggregatedNames(
  scadenza: any,
  utentiMap: Map<number, string>,
  clientiMap: Map<number, string>
) {
  const utenti_names = scadenza.scadenze_utenti
    .map((su: any) => utentiMap.get(su.utente_id))
    .filter(Boolean)
    .join(', ');

  const clienti_names = scadenza.scadenze_clienti
    .map((sc: any) => clientiMap.get(sc.cliente_id))
    .filter(Boolean)
    .join(', ');

  return {
    ...scadenza,
    utenti_names: utenti_names || null,
    clienti_names: clienti_names || null,
  };
}

export async function getAllScadenze(filters?: {
  cliente_id?: number;
  utente_id?: number;
  filter?: string;
  date_start?: string;
  date_end?: string;
}): Promise<ScadenzeWithRelations[]> {
  const where: any = { is_active: true };

  // Text search on name
  if (filters?.filter) {
    where.name = { contains: filters.filter, mode: 'insensitive' };
  }

  // Filter by cliente via junction
  if (filters?.cliente_id) {
    where.scadenze_clienti = {
      some: { cliente_id: filters.cliente_id, is_active: true },
    };
  }

  // Filter by utente via junction
  if (filters?.utente_id) {
    where.scadenze_utenti = {
      some: { utente_id: filters.utente_id, is_active: true },
    };
  }

  const scadenze = await prisma.scadenza.findMany({
    where,
    include: {
      scadenze_utenti: true,
      scadenze_clienti: true,
    },
  });

  // Apply date filtering on calculated_date (after computing recurring dates)
  let filtered = scadenze.map(withCalculatedDate);

  if (filters?.date_start || filters?.date_end) {
    const dateStart = filters.date_start ? new Date(filters.date_start) : null;
    const dateEnd = filters.date_end ? new Date(filters.date_end) : null;

    filtered = filtered.filter((s: any) => {
      const calculatedDate = s.calculated_date ? new Date(s.calculated_date) : null;
      if (!calculatedDate) return false;

      if (dateStart && calculatedDate < dateStart) return false;
      if (dateEnd && calculatedDate > dateEnd) return false;

      return true;
    });
  }

  // Sort by calculated_date for proper recurring date ordering
  filtered.sort((a: any, b: any) => {
    const dateA = a.calculated_date ? new Date(a.calculated_date).getTime() : 0;
    const dateB = b.calculated_date ? new Date(b.calculated_date).getTime() : 0;
    return dateA - dateB;
  });

  // Fetch utenti and clienti lookups once
  const [allUtenti, allClienti] = await Promise.all([
    prisma.utente.findMany({ where: { is_active: true } }),
    prisma.cliente.findMany({ where: { is_active: true } }),
  ]);

  const utentiMap = new Map(allUtenti.map((u) => [u.id, u.cognome || '']));
  const clientiMap = new Map(allClienti.map((c) => [c.id, c.name]));

  // Apply aggregated names
  return filtered.map((s: any) => withAggregatedNames(s, utentiMap, clientiMap));
}

export async function getScadenzaById(id: number): Promise<ScadenzeWithRelations> {
  const scadenza = await prisma.scadenza.findFirst({
    where: { id, is_active: true },
    include: {
      scadenze_utenti: true,
      scadenze_clienti: true,
    },
  });

  if (!scadenza) {
    throw new AppError(404, `Scadenza with id ${id} not found`);
  }

  const withCalc = withCalculatedDate(scadenza);

  // Fetch lookups for aggregated names
  const [allUtenti, allClienti] = await Promise.all([
    prisma.utente.findMany({ where: { is_active: true } }),
    prisma.cliente.findMany({ where: { is_active: true } }),
  ]);

  const utentiMap = new Map(allUtenti.map((u) => [u.id, u.cognome || '']));
  const clientiMap = new Map(allClienti.map((c) => [c.id, c.name]));

  return withAggregatedNames(withCalc, utentiMap, clientiMap);
}

export async function createScadenza(
  data: ScadenzeCreateRequest,
  userId?: number
): Promise<ScadenzeWithRelations> {
  const scadenza = await prisma.$transaction(async (tx) => {
    const created = await tx.scadenza.create({
      data: {
        name: data.name,
        rec: data.rec ?? 0,
        date: data.date ? new Date(data.date) : null,
        ins_user_id: userId ?? null,
      },
    });

    // Create utente junctions
    if (data.utente_ids && data.utente_ids.length > 0) {
      await tx.scadenzeUtente.createMany({
        data: data.utente_ids.map((utente_id) => ({
          scadenza_id: created.id,
          utente_id,
        })),
      });
    }

    // Create cliente junctions
    if (data.cliente_ids && data.cliente_ids.length > 0) {
      await tx.scadenzeClienti.createMany({
        data: data.cliente_ids.map((cliente_id) => ({
          scadenza_id: created.id,
          cliente_id,
        })),
      });
    }

    // Re-fetch with relations
    return tx.scadenza.findUniqueOrThrow({
      where: { id: created.id },
      include: {
        scadenze_utenti: true,
        scadenze_clienti: true,
      },
    });
  });

  return withCalculatedDate(scadenza);
}

export async function updateScadenza(
  id: number,
  data: ScadenzeUpdateRequest
): Promise<ScadenzeWithRelations> {
  // Verify exists and is active
  const existing = await prisma.scadenza.findFirst({
    where: { id, is_active: true },
  });

  if (!existing) {
    throw new AppError(404, `Scadenza with id ${id} not found`);
  }

  const scadenza = await prisma.$transaction(async (tx) => {
    // Update scadenza fields
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.rec !== undefined) updateData.rec = data.rec;
    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;

    await tx.scadenza.update({
      where: { id },
      data: updateData,
    });

    // Replace utente junctions: delete old, insert new
    if (data.utente_ids !== undefined) {
      await tx.scadenzeUtente.deleteMany({ where: { scadenza_id: id } });
      if (data.utente_ids.length > 0) {
        await tx.scadenzeUtente.createMany({
          data: data.utente_ids.map((utente_id) => ({
            scadenza_id: id,
            utente_id,
          })),
        });
      }
    }

    // Replace cliente junctions: delete old, insert new
    if (data.cliente_ids !== undefined) {
      await tx.scadenzeClienti.deleteMany({ where: { scadenza_id: id } });
      if (data.cliente_ids.length > 0) {
        await tx.scadenzeClienti.createMany({
          data: data.cliente_ids.map((cliente_id) => ({
            scadenza_id: id,
            cliente_id,
          })),
        });
      }
    }

    // Re-fetch with relations
    return tx.scadenza.findUniqueOrThrow({
      where: { id },
      include: {
        scadenze_utenti: true,
        scadenze_clienti: true,
      },
    });
  });

  return withCalculatedDate(scadenza);
}

export async function deleteScadenza(id: number, hard?: boolean): Promise<void> {
  const existing = await prisma.scadenza.findFirst({
    where: { id, ...(hard ? {} : { is_active: true }) },
  });

  if (!existing) {
    throw new AppError(404, `Scadenza with id ${id} not found`);
  }

  if (hard) {
    // Hard delete - Prisma cascade handles junction records
    await prisma.scadenza.delete({ where: { id } });
  } else {
    // Soft delete - deactivate scadenza and all junction records
    await prisma.$transaction(async (tx) => {
      await tx.scadenza.update({
        where: { id },
        data: { is_active: false },
      });
      await tx.scadenzeUtente.updateMany({
        where: { scadenza_id: id },
        data: { is_active: false },
      });
      await tx.scadenzeClienti.updateMany({
        where: { scadenza_id: id },
        data: { is_active: false },
      });
    });
  }
}
