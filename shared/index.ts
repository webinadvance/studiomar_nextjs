// Shared TypeScript types between frontend and backend

export interface Utente {
  id: number;
  email: string | null;
  nome: string | null;
  cognome: string | null;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

export interface Cliente {
  id: number;
  name: string;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

export interface Scadenza {
  id: number;
  name: string;
  rec: number; // Recurrence in months
  date: string | null;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
  calculated_date?: string; // Computed field (read-only)
}

export interface ScadenzeUtente {
  id: number;
  scadenza_id: number;
  utente_id: number;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

export interface ScadenzeClienti {
  id: number;
  scadenza_id: number;
  cliente_id: number;
  is_active: boolean;
  ins_date: string;
  mod_date: string;
  ins_user_id: number | null;
}

// Request/Response DTOs
export interface ScadenzeCreateRequest {
  name: string;
  rec?: number;
  date?: string;
  utente_ids?: number[];
  cliente_ids?: number[];
}

export interface ScadenzeUpdateRequest {
  name?: string;
  rec?: number;
  date?: string;
  utente_ids?: number[];
  cliente_ids?: number[];
}

export interface ScadenzeWithRelations extends Scadenza {
  scadenze_utenti?: ScadenzeUtente[];
  scadenze_clienti?: ScadenzeClienti[];
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
