import type { Application, StNotification } from "../types";
import { seedApplications } from "./applications";
import { seedNotifications } from "./notifications";

export interface SeedState {
  baseNow: number;
  applications: Application[];
  notifications: StNotification[];
}

// Build a fresh demo state. baseNow anchors all relative timestamps so SLA
// traffic lights are interesting on first paint.
export function seedState(): SeedState {
  const baseNow = Date.now();
  const applications = seedApplications(baseNow);
  const notifications = seedNotifications(baseNow, applications);
  return { baseNow, applications, notifications };
}

export * from "./personas";
export * from "./employers";
export * from "./competencies";
export * from "./charter";
