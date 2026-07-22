import type { User } from "@/types";
import type { Persona, PersonaRole } from "./types";
import { PERSONAS, ROLE_LABEL } from "./mock/personas";

const PERSONA_ROLES: PersonaRole[] = [
  "applicant",
  "employer",
  "sos",
  "sos_ce",
  "tp_sos",
  "technical",
  "technical_ce",
  "approver",
  "committee",
  "admin",
];

/** Map database `users.role` to the ST portal PersonaRole. */
export function dbRoleToPersonaRole(dbRole: string | undefined | null): PersonaRole | null {
  if (!dbRole) return null;
  if (dbRole === "pentadbir_sistem" || dbRole === "admin") return "admin";
  if (PERSONA_ROLES.includes(dbRole as PersonaRole)) return dbRole as PersonaRole;
  return null;
}

/** Resolve the active ST persona from an authenticated API user. */
export function personaFromUser(user: User): Persona | null {
  const matched = PERSONAS.find((p) => p.email.toLowerCase() === user.email.toLowerCase());
  if (matched) return matched;

  const role = dbRoleToPersonaRole(user.role);
  if (!role) return null;

  return {
    id: `user-${user.id}`,
    name: user.name,
    email: user.email,
    role,
    title: ROLE_LABEL[role],
  };
}

export function isStPortalUser(user: User | null): boolean {
  return user !== null && personaFromUser(user) !== null;
}
