import "server-only";
import { getSupabase } from "./supabase";
import { fromRow, toInsert, type Opportunity, type OpportunityRow } from "./opportunities";

const TABLE = "opportunities";

export type NewOpportunity = Omit<Opportunity, "id" | "createdAt">;

const today = () => new Date().toISOString().slice(0, 10); // mismo criterio (UTC) que isActive()
const isValidId = (id: string) => /^\d+$/.test(id);

function fail(action: string, error: { message: string }): never {
  throw new Error(`Supabase (${action}): ${error.message}`);
}

/** Todas las oportunidades (activas y cerradas), más recientes primero. Uso: panel de administración. */
export async function getAll(): Promise<Opportunity[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) fail("getAll", error);
  return (data as OpportunityRow[]).map(fromRow);
}

/** Solo oportunidades activas (cierre de hoy en adelante), por fecha de cierre. Uso: sitio público. */
export async function getActive(): Promise<Opportunity[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .gte("deadline", today())
    .order("deadline", { ascending: true });
  if (error) fail("getActive", error);
  return (data as OpportunityRow[]).map(fromRow);
}

export async function getById(id: string): Promise<Opportunity | undefined> {
  if (!isValidId(id)) return undefined; // evita error de conversión a bigint con ids inválidos
  const { data, error } = await getSupabase().from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) fail("getById", error);
  return data ? fromRow(data as OpportunityRow) : undefined;
}

/** Oportunidades activas de la misma categoría, excluyendo la actual. */
export async function getRelated(o: Opportunity, limit = 3): Promise<Opportunity[]> {
  const { data, error } = await getSupabase()
    .from(TABLE)
    .select("*")
    .eq("category", o.category)
    .neq("id", o.id)
    .gte("deadline", today())
    .order("deadline", { ascending: true })
    .limit(limit);
  if (error) fail("getRelated", error);
  return (data as OpportunityRow[]).map(fromRow);
}

export async function addOpportunity(input: NewOpportunity): Promise<Opportunity> {
  const { data, error } = await getSupabase().from(TABLE).insert(toInsert(input)).select().single();
  if (error) fail("addOpportunity", error);
  return fromRow(data as OpportunityRow);
}

/** Actualiza todos los campos editables. Conserva id y fecha de publicación. */
export async function updateOpportunity(id: string, input: NewOpportunity): Promise<Opportunity | undefined> {
  if (!isValidId(id)) return undefined;
  const { data, error } = await getSupabase()
    .from(TABLE)
    .update(toInsert(input)) // los opcionales vacíos se guardan como null / {}
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) fail("updateOpportunity", error);
  return data ? fromRow(data as OpportunityRow) : undefined;
}

export async function removeOpportunity(id: string): Promise<void> {
  if (!isValidId(id)) return;
  const { error } = await getSupabase().from(TABLE).delete().eq("id", id);
  if (error) fail("removeOpportunity", error);
}
