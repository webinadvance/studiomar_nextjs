// Shared TypeScript types between frontend and backend

export interface Utente {
  Id: number;
  Email: string | null;
  Nome: string | null;
  Cognome: string | null;
  IsActive: boolean;
  InsDate: string;
  ModDate: string;
  InsUserId: number | null;
}

export interface Cliente {
  Id: number;
  Name: string;
  IsActive: boolean;
  InsDate: string;
  ModDate: string;
  InsUserId: number | null;
}

export interface Scadenza {
  Id: number;
  Name: string;
  Rec: number; // Recurrence in months
  Date: string | null;
  IsActive: boolean;
  InsDate: string;
  ModDate: string;
  InsUserId: number | null;
  CalculatedDate?: string; // Computed field (read-only)
}

export interface ScadenzeUtente {
  Id: number;
  ScadenzaId: number | null;
  UtenteId: number | null;
  IsActive: boolean;
  InsDate: string;
  ModDate: string;
  InsUserId: number | null;
}

export interface ScadenzeClienti {
  Id: number;
  ScadenzaId: number | null;
  ClienteId: number | null;
  IsActive: boolean;
  InsDate: string;
  ModDate: string;
  InsUserId: number | null;
}

// Request/Response DTOs
export interface ScadenzeCreateRequest {
  Name: string;
  Rec?: number;
  Date?: string;
  UtenteIds?: number[];
  ClienteIds?: number[];
}

export interface ScadenzeUpdateRequest {
  Name?: string;
  Rec?: number;
  Date?: string;
  UtenteIds?: number[];
  ClienteIds?: number[];
}

export interface ScadenzeWithRelations extends Scadenza {
  ScadenzeUtenti?: ScadenzeUtente[];
  ScadenzeClienti?: ScadenzeClienti[];
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
