<?php

namespace Database\Seeders;

use App\Models\WorkflowDefinition;
use Illuminate\Database\Seeder;

/**
 * Seeds production-shaped PFD-RG-KE-NA and PFD-RG-CE-NA workflows (BRS).
 *
 * Human / approval gates create Peti Tugasan tasks for staff roles.
 * Applicant / employer / OK gates wait as human tasks (external actors).
 * Branching uses transitions + decision / employer_category context.
 *
 * Started automatically when matching registration applications are created
 * (see RegistrationWorkflowStarter). Peti UI wiring is a separate step.
 */
class WorkflowDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedOkElectric();
        $this->seedContractorElectric();
    }

    private function seedOkElectric(): void
    {
        $slug = 'pfd-rg-ke-na';

        $definition = [
            'name' => 'Pendaftaran OK Elektrik (PFD-RG-KE-NA)',
            'version' => '2.0',
            'steps' => [
                [
                    'id' => 'na-01-membuat-permohonan',
                    'name' => 'PFD-RG-KE-NA-01 · Membuat Permohonan',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-KE] Application submitted (profile, competency, period, documents, declarations). Actor: Orang Kompeten.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'na-02-memilih-majikan',
                    'name' => 'PFD-RG-KE-NA-02 · Memilih Majikan',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-KE] Employer selected (company path). Actor: Orang Kompeten.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'na-03-pengesahan-pelantikan',
                    'name' => 'PFD-RG-KE-NA-03 · Mengesahkan Pelantikan Kompeten',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'employer',
                        'outcomes' => ['confirm', 'decline'],
                        'sla_hours' => 336, // 14 days
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'notify-employer-confirmation',
                    'name' => 'Notifikasi pengesahan majikan + notis fi proses',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-KE] Pengesahan majikan berjaya — Notis Bayaran Fi Proses',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-04-bayaran-fi-proses',
                    'name' => 'PFD-RG-KE-NA-04 · Membuat Bayaran Fi Proses',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['paid', 'expired'],
                        'sla_hours' => 336,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-05-semakan-dokumen',
                    'name' => 'PFD-RG-KE-NA-05 · Membuat Semakan Dokumen',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'sos',
                        'outcomes' => ['lengkap', 'kemaskini', 'ditolak'],
                        'sla_hours' => 4,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-06-semakan-teknikal',
                    'name' => 'PFD-RG-KE-NA-06 · Membuat Semakan Teknikal',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'technical',
                        'outcomes' => ['lengkap', 'kemaskini', 'ditolak'],
                        'sla_hours' => 24,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-07-kemaskini-permohonan',
                    'name' => 'PFD-RG-KE-NA-07 · Kemaskini Permohonan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['resubmit', 'withdraw'],
                        'sla_hours' => 336,
                        'tab' => 'query',
                    ],
                ],
                [
                    'id' => 'na-08-kelulusan',
                    'name' => 'PFD-RG-KE-NA-08 · Membuat Kelulusan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'approver',
                        'outcomes' => ['lulus', 'kemaskini', 'ditolak'],
                        'sla_hours' => 8,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'notify-registration-fee',
                    'name' => 'Notifikasi notis bayaran fi pendaftaran',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-KE] Permohonan diluluskan — Notis Bayaran Fi Pendaftaran',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-09-bayaran-pendaftaran',
                    'name' => 'PFD-RG-KE-NA-09 · Membuat Bayaran Pendaftaran',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['paid', 'expired'],
                        'sla_hours' => 336,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-10-perakuan-digital',
                    'name' => 'PFD-RG-KE-NA-10 · Menerima Perakuan Pendaftaran',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-KE] Digital certificate of competent person registration issued. Actor: Sistem.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'notify-certificate-issued',
                    'name' => 'Notifikasi perakuan digital dikeluarkan',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-KE] Perakuan Digital Pendaftaran OK Elektrik telah dikeluarkan',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-11-permohonan-ditolak',
                    'name' => 'PFD-RG-KE-NA-11 · Menerima Makluman Permohonan Ditolak',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-KE] Application rejected. decision={{ decision }} note recorded for applicant. Actor: Sistem.',
                        'level' => 'warning',
                    ],
                ],
                [
                    'id' => 'notify-rejected',
                    'name' => 'Notifikasi permohonan ditolak',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-KE] Permohonan Pendaftaran OK Elektrik ditolak',
                        'template' => 'default',
                    ],
                ],
            ],
            'transitions' => [
                // Entry: company vs self-employed
                ['from' => 'na-01-membuat-permohonan', 'to' => 'na-02-memilih-majikan', 'condition' => 'employer_category === company'],
                ['from' => 'na-01-membuat-permohonan', 'to' => 'na-04-bayaran-fi-proses', 'condition' => 'employer_category === self_employed'],

                ['from' => 'na-02-memilih-majikan', 'to' => 'na-03-pengesahan-pelantikan'],

                ['from' => 'na-03-pengesahan-pelantikan', 'to' => 'notify-employer-confirmation', 'condition' => 'decision === confirm'],
                ['from' => 'na-03-pengesahan-pelantikan', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === decline'],
                ['from' => 'notify-employer-confirmation', 'to' => 'na-04-bayaran-fi-proses'],

                ['from' => 'na-04-bayaran-fi-proses', 'to' => 'na-05-semakan-dokumen', 'condition' => 'decision === paid'],
                ['from' => 'na-04-bayaran-fi-proses', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === expired'],

                // SOS
                ['from' => 'na-05-semakan-dokumen', 'to' => 'na-06-semakan-teknikal', 'condition' => 'decision === lengkap'],
                ['from' => 'na-05-semakan-dokumen', 'to' => 'na-07-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-05-semakan-dokumen', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === ditolak'],

                // Technical
                ['from' => 'na-06-semakan-teknikal', 'to' => 'na-08-kelulusan', 'condition' => 'decision === lengkap'],
                ['from' => 'na-06-semakan-teknikal', 'to' => 'na-07-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-06-semakan-teknikal', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === ditolak'],

                // Kemaskini → return to querying stage
                ['from' => 'na-07-kemaskini-permohonan', 'to' => 'na-05-semakan-dokumen', 'condition' => 'query_return_role === sos'],
                ['from' => 'na-07-kemaskini-permohonan', 'to' => 'na-06-semakan-teknikal', 'condition' => 'query_return_role === technical'],
                ['from' => 'na-07-kemaskini-permohonan', 'to' => 'na-08-kelulusan', 'condition' => 'query_return_role === approver'],
                ['from' => 'na-07-kemaskini-permohonan', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === withdraw'],

                // Approver
                ['from' => 'na-08-kelulusan', 'to' => 'notify-registration-fee', 'condition' => 'decision === lulus'],
                ['from' => 'na-08-kelulusan', 'to' => 'na-07-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-08-kelulusan', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === ditolak'],
                ['from' => 'notify-registration-fee', 'to' => 'na-09-bayaran-pendaftaran'],

                ['from' => 'na-09-bayaran-pendaftaran', 'to' => 'na-10-perakuan-digital', 'condition' => 'decision === paid'],
                ['from' => 'na-09-bayaran-pendaftaran', 'to' => 'na-11-permohonan-ditolak', 'condition' => 'decision === expired'],
                ['from' => 'na-10-perakuan-digital', 'to' => 'notify-certificate-issued'],

                ['from' => 'na-11-permohonan-ditolak', 'to' => 'notify-rejected'],
            ],
        ];

        WorkflowDefinition::updateOrCreate(
            ['slug' => $slug],
            [
                'name' => 'Pendaftaran OK Elektrik (PFD-RG-KE-NA)',
                'version' => '2.0',
                'description' => 'Production-shaped Electrical Competent Person new registration (RG-KE / BRS PFD-RG-KE-NA). '
                    .'Happy path: NA-01 → (company: NA-02→NA-03 | self-employed: skip) → NA-04 → NA-05 → NA-06 → NA-08 → NA-09 → NA-10. '
                    .'Branches: kemaskini (NA-07 return to querying role), ditolak (NA-11). '
                    .'Staff Peti roles: sos, technical (OK Elektrik), approver (shared). External waits: employer, applicant. '
                    .'Context: employer_category=company|self_employed; decision drives transitions.',
                'definition' => $this->withStepSla($definition),
                'is_active' => true,
            ],
        );
    }

    private function seedContractorElectric(): void
    {
        $slug = 'pfd-rg-ce-na';

        $definition = [
            'name' => 'Pendaftaran Kontraktor Elektrik (PFD-RG-CE-NA)',
            'version' => '2.0',
            'steps' => [
                [
                    'id' => 'na-01-membuat-permohonan',
                    'name' => 'PFD-RG-CE-NA-01 · Membuat Permohonan',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-CE] Contractor registration draft/submit captured (company, class, documents). Actor: Wakil Kontraktor.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'na-02-carian-ok',
                    'name' => 'PFD-RG-CE-NA-02 · Carian OK',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-CE] Competent person(s) selected for appointment. Actor: Wakil Kontraktor.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'na-03-menerima-pelantikan',
                    'name' => 'PFD-RG-CE-NA-03 · Menerima Pelantikan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'ok',
                        'outcomes' => ['accept', 'reject'],
                        'sla_hours' => 336,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'notify-ok-appointment-accepted',
                    'name' => 'Notifikasi pelantikan OK diterima',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-CE] Pelantikan OK diterima — Sila hantar & bayar fi proses',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-04-hantar-permohonan',
                    'name' => 'PFD-RG-CE-NA-04 · Hantar Permohonan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['submit'],
                        'sla_hours' => 168,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-05-bayaran-fi-proses',
                    'name' => 'PFD-RG-CE-NA-05 · Membuat Pembayaran Fi Proses',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['paid', 'expired'],
                        'sla_hours' => 336,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-06-semakan-dokumen',
                    'name' => 'PFD-RG-CE-NA-06 · Membuat Semakan Dokumen',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'sos_ce',
                        'outcomes' => ['lengkap', 'kemaskini', 'ditolak'],
                        'sla_hours' => 4,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-07-semakan-teknikal',
                    'name' => 'PFD-RG-CE-NA-07 · Membuat Semakan Teknikal',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'technical_ce',
                        'outcomes' => ['lengkap', 'kemaskini', 'ditolak'],
                        'sla_hours' => 24,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-08-kemaskini-permohonan',
                    'name' => 'PFD-RG-CE-NA-08 · Kemaskini Permohonan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['resubmit', 'withdraw'],
                        'sla_hours' => 336,
                        'tab' => 'query',
                    ],
                ],
                [
                    'id' => 'na-09-kelulusan',
                    'name' => 'PFD-RG-CE-NA-09 · Membuat Kelulusan',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'approver',
                        'outcomes' => ['lulus', 'kemaskini', 'ditolak'],
                        'sla_hours' => 8,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'notify-registration-fee',
                    'name' => 'Notifikasi notis bayaran fi pendaftaran',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-CE] Permohonan diluluskan — Notis Bayaran Fi Pendaftaran',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-10-bayaran-pendaftaran',
                    'name' => 'PFD-RG-CE-NA-10 · Membuat Bayaran Pendaftaran',
                    'action' => 'human',
                    'parameters' => [
                        'assign_to_role' => 'applicant',
                        'outcomes' => ['paid', 'expired'],
                        'sla_hours' => 336,
                        'tab' => 'new',
                    ],
                ],
                [
                    'id' => 'na-11-perakuan-digital',
                    'name' => 'PFD-RG-CE-NA-11 · Menerima Perakuan Pendaftaran',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-CE] Digital certificate of electrical contractor registration issued (+ QR). Actor: Sistem.',
                        'level' => 'info',
                    ],
                ],
                [
                    'id' => 'notify-certificate-issued',
                    'name' => 'Notifikasi perakuan digital dikeluarkan',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-CE] Perakuan Digital Pendaftaran Kontraktor Elektrik telah dikeluarkan',
                        'template' => 'default',
                    ],
                ],
                [
                    'id' => 'na-12-permohonan-ditolak',
                    'name' => 'PFD-RG-CE-NA-12 · Menerima Makluman Permohonan Ditolak',
                    'action' => 'log',
                    'parameters' => [
                        'message' => '[RG-CE] Application rejected. decision={{ decision }}. Actor: Sistem.',
                        'level' => 'warning',
                    ],
                ],
                [
                    'id' => 'notify-rejected',
                    'name' => 'Notifikasi permohonan ditolak',
                    'action' => \SolutionForest\WorkflowEngine\Actions\EmailAction::class,
                    'parameters' => [
                        'to' => '{{ user.email }}',
                        'subject' => '[RG-CE] Permohonan Pendaftaran Kontraktor Elektrik ditolak',
                        'template' => 'default',
                    ],
                ],
            ],
            'transitions' => [
                ['from' => 'na-01-membuat-permohonan', 'to' => 'na-02-carian-ok'],
                ['from' => 'na-02-carian-ok', 'to' => 'na-03-menerima-pelantikan'],

                ['from' => 'na-03-menerima-pelantikan', 'to' => 'notify-ok-appointment-accepted', 'condition' => 'decision === accept'],
                ['from' => 'na-03-menerima-pelantikan', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === reject'],
                ['from' => 'notify-ok-appointment-accepted', 'to' => 'na-04-hantar-permohonan'],

                ['from' => 'na-04-hantar-permohonan', 'to' => 'na-05-bayaran-fi-proses', 'condition' => 'decision === submit'],

                ['from' => 'na-05-bayaran-fi-proses', 'to' => 'na-06-semakan-dokumen', 'condition' => 'decision === paid'],
                ['from' => 'na-05-bayaran-fi-proses', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === expired'],

                ['from' => 'na-06-semakan-dokumen', 'to' => 'na-07-semakan-teknikal', 'condition' => 'decision === lengkap'],
                ['from' => 'na-06-semakan-dokumen', 'to' => 'na-08-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-06-semakan-dokumen', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === ditolak'],

                ['from' => 'na-07-semakan-teknikal', 'to' => 'na-09-kelulusan', 'condition' => 'decision === lengkap'],
                ['from' => 'na-07-semakan-teknikal', 'to' => 'na-08-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-07-semakan-teknikal', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === ditolak'],

                ['from' => 'na-08-kemaskini-permohonan', 'to' => 'na-06-semakan-dokumen', 'condition' => 'query_return_role === sos_ce'],
                ['from' => 'na-08-kemaskini-permohonan', 'to' => 'na-07-semakan-teknikal', 'condition' => 'query_return_role === technical_ce'],
                ['from' => 'na-08-kemaskini-permohonan', 'to' => 'na-09-kelulusan', 'condition' => 'query_return_role === approver'],
                ['from' => 'na-08-kemaskini-permohonan', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === withdraw'],

                ['from' => 'na-09-kelulusan', 'to' => 'notify-registration-fee', 'condition' => 'decision === lulus'],
                ['from' => 'na-09-kelulusan', 'to' => 'na-08-kemaskini-permohonan', 'condition' => 'decision === kemaskini'],
                ['from' => 'na-09-kelulusan', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === ditolak'],
                ['from' => 'notify-registration-fee', 'to' => 'na-10-bayaran-pendaftaran'],

                ['from' => 'na-10-bayaran-pendaftaran', 'to' => 'na-11-perakuan-digital', 'condition' => 'decision === paid'],
                ['from' => 'na-10-bayaran-pendaftaran', 'to' => 'na-12-permohonan-ditolak', 'condition' => 'decision === expired'],
                ['from' => 'na-11-perakuan-digital', 'to' => 'notify-certificate-issued'],

                ['from' => 'na-12-permohonan-ditolak', 'to' => 'notify-rejected'],
            ],
        ];

        WorkflowDefinition::updateOrCreate(
            ['slug' => $slug],
            [
                'name' => 'Pendaftaran Kontraktor Elektrik (PFD-RG-CE-NA)',
                'version' => '2.1',
                'description' => 'Production-shaped Electrical Contractor new registration (RG-CE / BRS PFD-RG-CE-NA). '
                    .'Happy path: NA-01 → NA-02 → NA-03 → NA-04 → NA-05 → NA-06 → NA-07 → NA-09 → NA-10 → NA-11. '
                    .'Branches: kemaskini (NA-08 return to querying role), ditolak (NA-12). '
                    .'Staff Peti roles: sos_ce, technical_ce, approver (shared). External waits: ok, applicant. '
                    .'Context decision drives transitions after each human gate.',
                'definition' => $this->withStepSla($definition),
                'is_active' => true,
            ],
        );
    }

    /**
     * Promote parameters.sla_hours onto first-class step.sla_target_hours for the workflow editor.
     *
     * @param  array<string, mixed>  $definition
     * @return array<string, mixed>
     */
    private function withStepSla(array $definition): array
    {
        $steps = $definition['steps'] ?? [];
        if (! is_array($steps)) {
            return $definition;
        }

        foreach ($steps as $i => $step) {
            if (! is_array($step)) {
                continue;
            }
            $params = is_array($step['parameters'] ?? null) ? $step['parameters'] : [];
            $sla = $step['sla_target_hours'] ?? $params['sla_hours'] ?? null;
            if (is_numeric($sla) && (int) $sla >= 1) {
                $steps[$i]['sla_target_hours'] = (int) $sla;
            }
        }

        $definition['steps'] = $steps;

        return $definition;
    }
}
