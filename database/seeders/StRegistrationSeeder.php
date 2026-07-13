<?php

namespace Database\Seeders;

use App\Models\StRegisteredEntity;
use App\Models\StRegistrationApplication;
use Illuminate\Database\Seeder;

/**
 * Seeds Phase 3 registration sample data for RG-KE (OK Elektrik)
 * and RG-CE (Kontraktor Elektrik) only — mirrors client mock/registration.ts.
 */
class StRegistrationSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->applications() as $row) {
            StRegistrationApplication::updateOrCreate(
                ['code' => $row['code']],
                $row,
            );
        }

        foreach ($this->entities() as $row) {
            StRegisteredEntity::updateOrCreate(
                ['code' => $row['code']],
                $row,
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function applications(): array
    {
        $apps = [
            // ── RG-KE ──
            [
                'code' => 'rg-ke-1',
                'module_code' => 'RG-KE',
                'ref_no' => 'ST/RG-KE/2026/00041',
                'app_type' => 'new_registration',
                'applicant_name' => 'Ahmad bin Ismail',
                'identity_no' => '850101-10-5432',
                'category_or_class' => 'PW4',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(2),
                'stage_entered_at' => $this->hoursAgo(18),
                'sla_target_hours' => 24,
                'employer_name' => 'Syarikat Elektrik Maju Sdn Bhd',
                'cdp_points' => 12,
                'assigned_officer' => 'Faridah Hassan',
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-ke-2',
                'module_code' => 'RG-KE',
                'ref_no' => 'ST/RG-KE/2026/00038',
                'app_type' => 'renewal',
                'applicant_name' => 'Siti Nurhaliza binti Kamal',
                'identity_no' => '900215-14-2211',
                'category_or_class' => 'JEK',
                'status' => 'technical_review',
                'submitted_at' => $this->daysAgo(5),
                'stage_entered_at' => $this->hoursAgo(40),
                'sla_target_hours' => 72,
                'employer_name' => 'Tenaga Power Solutions Sdn Bhd',
                'cdp_points' => 28,
                'assigned_officer' => 'Kumar a/l Rajan',
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-ke-3',
                'module_code' => 'RG-KE',
                'ref_no' => 'ST/RG-KE/2026/00035',
                'app_type' => 'multi_employer',
                'applicant_name' => 'Lim Wei Jie',
                'identity_no' => '880330-08-3344',
                'category_or_class' => 'PE',
                'status' => 'awaiting_employer_confirm',
                'submitted_at' => $this->daysAgo(1),
                'stage_entered_at' => $this->hoursAgo(8),
                'sla_target_hours' => 48,
                'employer_name' => 'Metro Switchgear Sdn Bhd',
                'cdp_points' => 20,
                'fee_amount' => 30,
            ],
            [
                'code' => 'rg-ke-4',
                'module_code' => 'RG-KE',
                'ref_no' => 'ST/RG-KE/2026/00029',
                'app_type' => 'new_registration',
                'applicant_name' => 'Nurul Aina binti Razak',
                'identity_no' => '920512-03-7788',
                'category_or_class' => 'PW2',
                'status' => 'certificate_issued',
                'submitted_at' => $this->daysAgo(21),
                'stage_entered_at' => $this->daysAgo(3),
                'sla_target_hours' => 24,
                'employer_name' => 'Ampere Engineering Sdn Bhd',
                'cdp_points' => 15,
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-ke-5',
                'module_code' => 'RG-KE',
                'ref_no' => 'ST/RG-KE/2026/00044',
                'app_type' => 'termination',
                'applicant_name' => 'Mohd Hafiz bin Osman',
                'identity_no' => '870820-05-1122',
                'category_or_class' => 'PW3',
                'status' => 'query_applicant',
                'submitted_at' => $this->daysAgo(4),
                'stage_entered_at' => $this->hoursAgo(30),
                'sla_target_hours' => 48,
                'employer_name' => 'Voltcare Services Sdn Bhd',
                'note' => 'Dokumen surat penamatan majikan tidak lengkap',
                'fee_amount' => 0,
            ],

            // ── RG-CE ──
            [
                'code' => 'rg-ce-1',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00061',
                'app_type' => 'new_registration',
                'applicant_name' => 'Elektro Prima Sdn Bhd',
                'identity_no' => '201501012345 (1122334-A)',
                'category_or_class' => 'B',
                'status' => 'technical_review',
                'submitted_at' => $this->daysAgo(6),
                'stage_entered_at' => $this->hoursAgo(55),
                'sla_target_hours' => 72,
                'assigned_officer' => 'Kumar a/l Rajan',
                'fee_amount' => 200,
                'note' => '3 Orang Kompeten dilantik (PW4, PW3, PW2)',
            ],
            [
                'code' => 'rg-ce-2',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00058',
                'app_type' => 'class_change',
                'applicant_name' => 'Voltworks Engineering Sdn Bhd',
                'identity_no' => '201201098765 (9988776-X)',
                'category_or_class' => 'A',
                'status' => 'pending_approval',
                'submitted_at' => $this->daysAgo(10),
                'stage_entered_at' => $this->hoursAgo(28),
                'sla_target_hours' => 48,
                'assigned_officer' => 'Zainab Omar',
                'fee_amount' => 150,
                'note' => 'Naik taraf Kelas C → A',
            ],
            [
                'code' => 'rg-ce-3',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00055',
                'app_type' => 'ok_appointment',
                'applicant_name' => 'Cahaya Wiring Enterprise',
                'identity_no' => 'SA0123456-A',
                'category_or_class' => 'D',
                'status' => 'awaiting_employer_confirm',
                'submitted_at' => $this->daysAgo(2),
                'stage_entered_at' => $this->hoursAgo(12),
                'sla_target_hours' => 48,
                'fee_amount' => 30,
                'note' => 'Menunggu pengesahan OK: Ahmad bin Ismail (PW4)',
            ],
            [
                'code' => 'rg-ce-4',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00050',
                'app_type' => 'renewal',
                'applicant_name' => 'Mega Circuit Sdn Bhd',
                'identity_no' => '200801045678 (5566778-U)',
                'category_or_class' => 'C',
                'status' => 'certificate_issued',
                'submitted_at' => $this->daysAgo(40),
                'stage_entered_at' => $this->daysAgo(7),
                'sla_target_hours' => 72,
                'fee_amount' => 200,
            ],
            [
                'code' => 'rg-ce-5',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00063',
                'app_type' => 'new_registration',
                'applicant_name' => 'Nexus Power Sdn Bhd',
                'identity_no' => '201901023456 (2233445-V)',
                'category_or_class' => 'C',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(1),
                'stage_entered_at' => $this->hoursAgo(5),
                'sla_target_hours' => 24,
                'assigned_officer' => 'Faridah Hassan',
                'fee_amount' => 200,
            ],
        ];

        return array_map(fn (array $app) => $this->enrichOkDetail($app), $apps);
    }

    /**
     * @param  array<string, mixed>  $app
     * @return array<string, mixed>
     */
    private function enrichOkDetail(array $app): array
    {
        if (($app['module_code'] ?? '') !== 'RG-KE') {
            return $app;
        }

        $app['detail'] = [
            'age' => 41,
            'gender' => 'male',
            'periodYears' => 1,
            'employerCategory' => ! empty($app['employer_name']) ? 'company' : 'self_employed',
            'certificate' => [
                'certificateNo' => 'COMP/'.$app['category_or_class'].'/2024/'.substr($app['code'], -3),
                'category' => $app['category_or_class'],
                'voltageRestriction' => 'lv',
                'placeRestriction' => 'none',
                'active' => true,
                'suspended' => false,
            ],
            'timeline' => [
                [
                    'at' => $app['submitted_at'],
                    'label' => 'Permohonan dihantar',
                    'actor' => $app['applicant_name'],
                ],
                [
                    'at' => $app['stage_entered_at'],
                    'label' => 'Status: '.$app['status'],
                    'actor' => $app['assigned_officer'] ?? 'Sistem',
                ],
            ],
        ];

        return $app;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function entities(): array
    {
        return [
            [
                'code' => 'ent-ke-1',
                'module_code' => 'RG-KE',
                'certificate_no' => 'OK-E/PW4/2024/00821',
                'holder_name' => 'Ahmad bin Ismail',
                'identity_no' => '850101-10-5432',
                'category_or_class' => 'PW4',
                'employer_name' => 'Syarikat Elektrik Maju Sdn Bhd',
                'registered_at' => $this->daysAgo(400),
                'expires_at' => $this->daysFromNow(45),
                'compliance' => 'expiring_soon',
                'cdp_points' => 22,
            ],
            [
                'code' => 'ent-ke-2',
                'module_code' => 'RG-KE',
                'certificate_no' => 'OK-E/JEK/2023/00412',
                'holder_name' => 'Siti Nurhaliza binti Kamal',
                'identity_no' => '900215-14-2211',
                'category_or_class' => 'JEK',
                'employer_name' => 'Tenaga Power Solutions Sdn Bhd',
                'registered_at' => $this->daysAgo(700),
                'expires_at' => $this->daysFromNow(120),
                'compliance' => 'active',
                'cdp_points' => 35,
            ],
            [
                'code' => 'ent-ke-3',
                'module_code' => 'RG-KE',
                'certificate_no' => 'OK-E/PW2/2022/01102',
                'holder_name' => 'Tan Kok Weng',
                'identity_no' => '820101-08-9900',
                'category_or_class' => 'PW2',
                'employer_name' => '—',
                'registered_at' => $this->daysAgo(900),
                'expires_at' => $this->daysFromNow(-20),
                'compliance' => 'expired',
                'cdp_points' => 8,
            ],
            [
                'code' => 'ent-ce-1',
                'module_code' => 'RG-CE',
                'certificate_no' => 'CE/B/2024/00301',
                'holder_name' => 'Elektro Prima Sdn Bhd',
                'identity_no' => '201501012345 (1122334-A)',
                'category_or_class' => 'B',
                'registered_at' => $this->daysAgo(350),
                'expires_at' => $this->daysFromNow(90),
                'compliance' => 'active',
                'cdp_points' => 40,
            ],
            [
                'code' => 'ent-ce-2',
                'module_code' => 'RG-CE',
                'certificate_no' => 'CE/C/2022/00777',
                'holder_name' => 'Mega Circuit Sdn Bhd',
                'identity_no' => '200801045678 (5566778-U)',
                'category_or_class' => 'C',
                'registered_at' => $this->daysAgo(800),
                'expires_at' => $this->daysFromNow(-5),
                'compliance' => 'expired',
                'cdp_points' => 12,
            ],
            [
                'code' => 'ent-ce-3',
                'module_code' => 'RG-CE',
                'certificate_no' => 'CE/D/2025/00110',
                'holder_name' => 'Cahaya Wiring Enterprise',
                'identity_no' => 'SA0123456-A',
                'category_or_class' => 'D',
                'registered_at' => $this->daysAgo(120),
                'expires_at' => $this->daysFromNow(200),
                'compliance' => 'active',
                'cdp_points' => 16,
            ],
        ];
    }

    private function daysAgo(int $days): string
    {
        return now()->subDays($days)->toIso8601String();
    }

    private function hoursAgo(int $hours): string
    {
        return now()->subHours($hours)->toIso8601String();
    }

    private function daysFromNow(int $days): string
    {
        return now()->addDays($days)->toIso8601String();
    }
}
