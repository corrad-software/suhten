import type { Application, StNotification } from "../types";

let seq = 0;

function iso(baseNow: number, hoursAgo: number): string {
  return new Date(baseNow - hoursAgo * 3_600_000).toISOString();
}

// Derive a small set of seed notifications from the seeded applications so the
// bell shows realistic unread items per persona on load.
export function seedNotifications(baseNow: number, applications: Application[]): StNotification[] {
  seq = 0;
  const out: StNotification[] = [];

  const push = (n: Omit<StNotification, "id">) => out.push({ id: `ntf-${++seq}`, ...n });

  for (const app of applications) {
    switch (app.status) {
      case "awaiting_employer_confirm":
        if (app.employer) {
          push({
            personaId: app.employer.confirmerPersonaId,
            type: "appointment_request",
            title: "Pengesahan lantikan diperlukan",
            body: `${app.applicant.fullName} memohon pengesahan lantikan (${app.refNo}).`,
            applicationId: app.id,
            createdAt: iso(baseNow, 4),
            read: false,
          });
        }
        break;
      case "sos_review":
        push({
          personaId: "p-faridah",
          type: "task_assigned",
          title: "Tugasan baharu di peti masuk",
          body: `Permohonan ${app.refNo} menunggu semakan SOS.`,
          applicationId: app.id,
          createdAt: app.stageEnteredAt,
          read: false,
        });
        break;
      case "query_applicant":
        push({
          personaId: app.applicantPersonaId,
          type: "query_raised",
          title: "Pertanyaan daripada SOS",
          body: `Permohonan ${app.refNo} memerlukan tindakan anda.`,
          applicationId: app.id,
          createdAt: iso(baseNow, 5),
          read: false,
        });
        break;
      case "technical_review":
        push({
          personaId: "p-kumar",
          type: "task_assigned",
          title: "Tugasan semakan teknikal",
          body: `Permohonan ${app.refNo} menunggu semakan teknikal.`,
          applicationId: app.id,
          createdAt: app.stageEnteredAt,
          read: false,
        });
        break;
      case "pending_approval":
        push({
          personaId: "p-zainab",
          type: "task_assigned",
          title: "Permohonan menunggu kelulusan",
          body: `Permohonan ${app.refNo} menunggu kelulusan & tandatangan digital.`,
          applicationId: app.id,
          createdAt: app.stageEnteredAt,
          read: false,
        });
        break;
      case "certificate_issued":
        push({
          personaId: app.applicantPersonaId,
          type: "certificate_issued",
          title: "Sijil digital dikeluarkan",
          body: `Sijil bagi ${app.refNo} telah dikeluarkan.`,
          applicationId: app.id,
          createdAt: iso(baseNow, 1),
          read: false,
        });
        break;
    }
  }

  return out;
}
