<?php

namespace Database\Seeders;

use App\Models\StRegisteredEntity;
use App\Models\StRegistrationApplication;
use Illuminate\Database\Seeder;

/**
 * Seeds Phase 3 registration sample data for RG-KE / RG-KG / RG-CE / RG-CG
 * — mirrors client mock/registration.ts.
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

            // ── RG-KG ──
            [
                'code' => 'rg-kg-1',
                'module_code' => 'RG-KG',
                'ref_no' => 'ST/RG-KG/2026/00012',
                'app_type' => 'new_registration',
                'applicant_name' => 'Razak bin Abdullah',
                'identity_no' => '860707-10-9988',
                'category_or_class' => 'GPE',
                'status' => 'pending_approval',
                'submitted_at' => $this->daysAgo(8),
                'stage_entered_at' => $this->hoursAgo(20),
                'sla_target_hours' => 48,
                'employer_name' => 'GasTech Malaysia Sdn Bhd',
                'cdp_points' => 18,
                'assigned_officer' => 'Zainab Omar',
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-kg-2',
                'module_code' => 'RG-KG',
                'ref_no' => 'ST/RG-KG/2026/00009',
                'app_type' => 'renewal',
                'applicant_name' => 'Chong Mei Ling',
                'identity_no' => '910404-14-5566',
                'category_or_class' => 'GJE',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(3),
                'stage_entered_at' => $this->hoursAgo(10),
                'sla_target_hours' => 24,
                'employer_name' => 'Petronas Gas Retail Sdn Bhd',
                'cdp_points' => 32,
                'assigned_officer' => 'Faridah Hassan',
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-kg-3',
                'module_code' => 'RG-KG',
                'ref_no' => 'ST/RG-KG/2026/00007',
                'app_type' => 'employer_registration',
                'applicant_name' => 'Hafizah binti Yusof',
                'identity_no' => '890119-06-3344',
                'category_or_class' => 'GPE',
                'status' => 'awaiting_processing_payment',
                'submitted_at' => $this->daysAgo(1),
                'stage_entered_at' => $this->hoursAgo(6),
                'sla_target_hours' => 72,
                'employer_name' => 'Industrial Gas Hub Sdn Bhd',
                'cdp_points' => 10,
                'fee_amount' => 50,
            ],
            [
                'code' => 'rg-kg-4',
                'module_code' => 'RG-KG',
                'ref_no' => 'ST/RG-KG/2026/00005',
                'app_type' => 'new_registration',
                'applicant_name' => 'Arif bin Salleh',
                'identity_no' => '930225-01-6677',
                'category_or_class' => 'GPW',
                'status' => 'certificate_issued',
                'submitted_at' => $this->daysAgo(30),
                'stage_entered_at' => $this->daysAgo(5),
                'sla_target_hours' => 24,
                'employer_name' => 'SafeGas Contractors Sdn Bhd',
                'cdp_points' => 14,
                'fee_amount' => 50,
            ],

            // ── RG-CE ──
            [
                'code' => 'rg-ce-1',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00061',
                'app_type' => 'new_registration',
                'applicant_name' => 'Syarikat Elektrik Maju Sdn Bhd',
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
                'applicant_name' => 'Tenaga Murni Sdn Bhd',
                'identity_no' => '200801012345 (812345-A)',
                'category_or_class' => 'C',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(1),
                'stage_entered_at' => $this->hoursAgo(5),
                'sla_target_hours' => 24,
                // Unclaimed in SOS CE Baharu — officer is set only when someone takes the task.
                'assigned_officer' => null,
                'employer_name' => 'Tenaga Murni Sdn Bhd',
                'fee_amount' => 200,
                'note' => 'Permohonan majikan Tenaga Murni (wakil: Rahman bin Abdullah)',
            ],
            [
                'code' => 'rg-ce-6',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00070',
                'app_type' => 'new_registration',
                'applicant_name' => 'ABC Elektrik Sdn Bhd',
                'identity_no' => '201901089012 (1289012-H)',
                'category_or_class' => 'B',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(2),
                'stage_entered_at' => $this->hoursAgo(8),
                'sla_target_hours' => 24,
                'assigned_officer' => 'Halim bin Rahim',
                'employer_name' => 'ABC Elektrik Sdn Bhd',
                'fee_amount' => 200,
                'note' => 'Permohonan majikan ABC Elektrik (wakil: Ahmad Faizal bin Omar)',
            ],
            [
                'code' => 'rg-ce-7',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00068',
                'app_type' => 'class_change',
                'applicant_name' => 'ABC Elektrik Sdn Bhd',
                'identity_no' => '201901089012 (1289012-H)',
                'category_or_class' => 'A',
                'status' => 'technical_review',
                'submitted_at' => $this->daysAgo(8),
                'stage_entered_at' => $this->hoursAgo(40),
                'sla_target_hours' => 72,
                'assigned_officer' => 'Priya a/p Nair',
                'employer_name' => 'ABC Elektrik Sdn Bhd',
                'fee_amount' => 150,
                'note' => 'Naik taraf Kelas B → A',
            ],
            [
                'code' => 'rg-ce-8',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00065',
                'app_type' => 'renewal',
                'applicant_name' => 'ABC Elektrik Sdn Bhd',
                'identity_no' => '201901089012 (1289012-H)',
                'category_or_class' => 'B',
                'status' => 'awaiting_registration_payment',
                'submitted_at' => $this->daysAgo(14),
                'stage_entered_at' => $this->hoursAgo(20),
                'sla_target_hours' => 72,
                'employer_name' => 'ABC Elektrik Sdn Bhd',
                'fee_amount' => 200,
                'note' => 'Pembaharuan pendaftaran kontraktor',
            ],
            [
                'code' => 'rg-ce-9',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00062',
                'app_type' => 'ok_appointment',
                'applicant_name' => 'ABC Elektrik Sdn Bhd',
                'identity_no' => '201901089012 (1289012-H)',
                'category_or_class' => 'B',
                'status' => 'awaiting_employer_confirm',
                'submitted_at' => $this->daysAgo(1),
                'stage_entered_at' => $this->hoursAgo(6),
                'sla_target_hours' => 48,
                'employer_name' => 'ABC Elektrik Sdn Bhd',
                'fee_amount' => 30,
                'note' => 'Menunggu pengesahan lantikan OK: Suresh a/l Maniam (PW3)',
            ],
            [
                // PFD-RG-CE-NA-04 — after OK Rizal accepted; majikan (Rahman) hantar permohonan.
                'code' => 'rg-ce-10',
                'module_code' => 'RG-CE',
                'ref_no' => 'ST/RG-CE/2026/00064',
                'app_type' => 'new_registration',
                'applicant_name' => 'Tenaga Murni Sdn Bhd',
                'identity_no' => '200801012345 (812345-A)',
                'category_or_class' => 'C',
                'status' => 'awaiting_final_submit',
                'submitted_at' => $this->hoursAgo(10),
                'stage_entered_at' => $this->hoursAgo(1),
                'sla_target_hours' => 168,
                'employer_name' => 'Tenaga Murni Sdn Bhd',
                'fee_amount' => 200,
                'note' => 'PFD-RG-CE-NA-04 · OK Rizal telah terima pelantikan — tunggu majikan hantar permohonan',
            ],

            // ── RG-CG ──
            [
                'code' => 'rg-cg-1',
                'module_code' => 'RG-CG',
                'ref_no' => 'ST/RG-CG/2026/00018',
                'app_type' => 'new_registration',
                'applicant_name' => 'GasLink Contractors Sdn Bhd',
                'identity_no' => '201701067890 (3344556-W)',
                'category_or_class' => 'G1',
                'status' => 'sos_review',
                'submitted_at' => $this->daysAgo(3),
                'stage_entered_at' => $this->hoursAgo(22),
                'sla_target_hours' => 24,
                'assigned_officer' => 'Faridah Hassan',
                'fee_amount' => 250,
            ],
            [
                'code' => 'rg-cg-2',
                'module_code' => 'RG-CG',
                'ref_no' => 'ST/RG-CG/2026/00015',
                'app_type' => 'renewal',
                'applicant_name' => 'Pipeline Pros Sdn Bhd',
                'identity_no' => '201001034567 (7788990-P)',
                'category_or_class' => 'G2',
                'status' => 'awaiting_registration_payment',
                'submitted_at' => $this->daysAgo(12),
                'stage_entered_at' => $this->hoursAgo(36),
                'sla_target_hours' => 72,
                'fee_amount' => 250,
            ],
            [
                'code' => 'rg-cg-3',
                'module_code' => 'RG-CG',
                'ref_no' => 'ST/RG-CG/2026/00011',
                'app_type' => 'ok_appointment',
                'applicant_name' => 'SafePipe Services Sdn Bhd',
                'identity_no' => '201601078901 (4455667-Q)',
                'category_or_class' => 'G1',
                'status' => 'query_applicant',
                'submitted_at' => $this->daysAgo(7),
                'stage_entered_at' => $this->hoursAgo(50),
                'sla_target_hours' => 48,
                'note' => 'Sijil kompeten gas OK tidak sah / tamat tempoh',
                'fee_amount' => 30,
            ],
            [
                'code' => 'rg-cg-4',
                'module_code' => 'RG-CG',
                'ref_no' => 'ST/RG-CG/2026/00008',
                'app_type' => 'new_registration',
                'applicant_name' => 'Borneo Gas Works Sdn Bhd',
                'identity_no' => '201401056789 (6677889-R)',
                'category_or_class' => 'G3',
                'status' => 'certificate_issued',
                'submitted_at' => $this->daysAgo(45),
                'stage_entered_at' => $this->daysAgo(10),
                'sla_target_hours' => 72,
                'fee_amount' => 250,
            ],
        ];

        return array_map(fn (array $app) => $this->enrichDetail($app), $apps);
    }

    /**
     * @param  array<string, mixed>  $app
     * @return array<string, mixed>
     */
    private function enrichDetail(array $app): array
    {
        return match ($app['module_code'] ?? '') {
            'RG-KE' => $this->enrichOkDetail($app),
            'RG-CE' => $this->enrichCeDetail($app),
            default => $app,
        };
    }

    /**
     * @param  array<string, mixed>  $app
     * @return array<string, mixed>
     */
    private function enrichOkDetail(array $app): array
    {
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
     * Prototype CE detail payload for staff review screens (Bahagian A–F).
     *
     * @param  array<string, mixed>  $app
     * @return array<string, mixed>
     */
    private function enrichCeDetail(array $app): array
    {
        $class = (string) ($app['category_or_class'] ?? 'C');
        $company = (string) ($app['applicant_name'] ?? 'Syarikat Contoh Sdn Bhd');
        $regNo = (string) ($app['identity_no'] ?? '');
        $suffix = substr((string) ($app['code'] ?? 'ce'), -1);
        $repName = match ($app['code'] ?? '') {
            'rg-ce-1' => 'Lim Wei Sheng',
            'rg-ce-2' => 'Tan Mei Ling',
            'rg-ce-3' => 'Ravi a/l Kumar',
            'rg-ce-4' => 'Azman bin Hassan',
            'rg-ce-5', 'rg-ce-10' => 'Rahman bin Abdullah',
            'rg-ce-6', 'rg-ce-7', 'rg-ce-8', 'rg-ce-9' => 'Ahmad Faizal bin Omar',
            default => 'Farid bin Abdullah',
        };
        $repIc = '8'.$suffix.'0101-10-5'.$suffix.'23';
        $city = match ($app['code'] ?? '') {
            'rg-ce-1' => 'Petaling Jaya',
            'rg-ce-2' => 'Shah Alam',
            'rg-ce-3' => 'Klang',
            'rg-ce-4' => 'Subang Jaya',
            'rg-ce-5', 'rg-ce-10' => 'Shah Alam',
            'rg-ce-6', 'rg-ce-7', 'rg-ce-8', 'rg-ce-9' => 'Subang Jaya',
            default => 'Cyberjaya',
        };
        $postcode = match ($app['code'] ?? '') {
            'rg-ce-1' => '47810',
            'rg-ce-2' => '40000',
            'rg-ce-3' => '41000',
            'rg-ce-4' => '47500',
            'rg-ce-5', 'rg-ce-10' => '40000',
            'rg-ce-6', 'rg-ce-7', 'rg-ce-8', 'rg-ce-9' => '47600',
            default => '63000',
        };

        $ownership = match ($app['code'] ?? '') {
            'rg-ce-1' => ['applicantPersonaId' => 'p-lim', 'employerId' => 'emp-elektrik-maju'],
            'rg-ce-5', 'rg-ce-10' => ['applicantPersonaId' => 'p-rahman', 'employerId' => 'emp-tenaga-murni'],
            'rg-ce-6', 'rg-ce-7', 'rg-ce-8', 'rg-ce-9' => [
                'applicantPersonaId' => 'p-faizal',
                'employerId' => 'emp-abc-elektrik',
            ],
            default => null,
        };
        $employerId = $ownership['employerId'] ?? null;

        $detail = [
            'gender' => 'male',
            'phone' => '012-345678'.$suffix,
            'email' => 'wakil@'.strtolower(preg_replace('/[^a-z0-9]+/i', '', explode(' ', $company)[0] ?? 'syarikat')).'.my',
            'periodYears' => 1,
            'documents' => [
                ['label' => 'Sijil pendaftaran SSM / Borang 9', 'fileName' => 'ssm-borang-9.pdf'],
                ['label' => 'Borang 49 / senarai pengarah', 'fileName' => 'borang-49.pdf'],
                ['label' => 'Surat lantikan Orang Kompeten', 'fileName' => 'surat-lantikan-ok.pdf'],
                ['label' => 'Foto premis / operasi', 'fileName' => 'foto-premis.jpg'],
            ],
            'timeline' => [
                [
                    'at' => $app['submitted_at'],
                    'label' => 'Permohonan dihantar',
                    'actor' => $repName,
                ],
                [
                    'at' => $app['stage_entered_at'],
                    'label' => 'Status: '.$app['status'],
                    'actor' => $app['assigned_officer'] ?? 'Sistem',
                ],
            ],
            'ce' => [
                'contractorKind' => 'electrical',
                'contractorClass' => $class,
                'voltage' => $class === 'A' ? '33kV' : '415V',
                'representativeName' => $repName,
                'representativeIc' => $repIc,
                'companyName' => $company,
                'companyRegNo' => $regNo,
                'companyAddress' => 'Lot '.$suffix.', Jalan Industri 2/'.$suffix,
                'postcode' => $postcode,
                'city' => $city,
                'state' => 'Selangor',
                'companyEmail' => 'info@'.strtolower(preg_replace('/[^a-z0-9]+/i', '', explode(' ', $company)[0] ?? 'syarikat')).'.my',
                'companyPhone' => '03-8'.$suffix.'45678'.$suffix,
                'companyFax' => '03-8'.$suffix.'45679'.$suffix,
                'directors' => [
                    [
                        'id' => 'dir-'.$app['code'],
                        'name' => $repName,
                        'icNumber' => $repIc,
                        'address' => 'No. '.$suffix.'2, Taman Industri, '.$postcode.' '.$city.', Selangor',
                        'sharePercent' => 100,
                    ],
                ],
                'appointedOks' => $this->appointedOksForEmployer(
                    $employerId,
                    (string) ($app['code'] ?? 'ce'),
                    $class,
                    (string) ($app['status'] ?? ''),
                ),
                'skilledPersons' => [],
                'professionalEngineers' => [],
                'equipment' => [
                    [
                        'id' => 'eq-'.$app['code'].'-1',
                        'equipmentType' => 'insulation_tester',
                        'serialNo' => 'INS-2024-'.$suffix.'01',
                        'brand' => 'fluke',
                        'model' => '1507',
                    ],
                    [
                        'id' => 'eq-'.$app['code'].'-2',
                        'equipmentType' => 'earth_tester',
                        'serialNo' => 'EAR-2024-'.$suffix.'02',
                        'brand' => 'megger',
                        'model' => 'DET3TD',
                    ],
                ],
                'confirmationChecks' => ['class_ok', 'company_ok', 'ok_ok', 'equip_ok', 'docs_ok'],
            ],
        ];

        if ($ownership !== null) {
            $detail['applicantPersonaId'] = $ownership['applicantPersonaId'];
            $detail['employerId'] = $ownership['employerId'];
        }

        $app['detail'] = $detail;

        return $app;
    }

    /**
     * Ahmad / Tan reserved for Tenaga Murni CE; ABC uses other pool OKs.
     * rg-ce-10 (PFD-RG-CE-NA-03) uses Rizal as the login-linked lead confirmer.
     *
     * @return list<array<string, mixed>>
     */
    private function appointedOksForEmployer(?string $employerId, string $code, string $class, string $status = ''): array
    {
        $abcPool = [
            ['okId' => 'ok-rizal', 'name' => 'Rizal bin Hassan', 'mykad' => '870404-10-5512', 'wirerType' => 'PW4', 'certificateNo' => 'COMP/PW4/2023/00644', 'personaId' => 'p-rizal'],
            ['okId' => 'ok-suresh', 'name' => 'Suresh a/l Maniam', 'mykad' => '880101-14-5099', 'wirerType' => 'PW3', 'certificateNo' => 'COMP/PW3/2022/01102'],
            ['okId' => 'ok-lim-mei', 'name' => 'Lim Mei Ling', 'mykad' => '900818-14-5220', 'wirerType' => 'PW3', 'certificateNo' => 'COMP/PW3/2024/00721'],
            ['okId' => 'ok-faizal', 'name' => 'Mohd Faizal bin Yusof', 'mykad' => '910722-05-5331', 'wirerType' => 'PW2', 'certificateNo' => 'COMP/PW2/2024/00211'],
            ['okId' => 'ok-azman', 'name' => 'Azman bin Rahim', 'mykad' => '830909-12-5443', 'wirerType' => 'PW1', 'certificateNo' => 'COMP/PW1/2020/00771'],
            ['okId' => 'ok-vimala', 'name' => 'Vimala a/p Krishnan', 'mykad' => '920215-08-5688', 'wirerType' => 'PW1', 'certificateNo' => 'COMP/PW1/2023/00330'],
        ];
        $tenagaPool = [
            ['okId' => 'ok-ahmad', 'name' => 'Ahmad bin Ismail', 'mykad' => '840512-10-5523', 'wirerType' => 'PW4', 'certificateNo' => 'COMP/PW4/2024/00821', 'personaId' => 'p-ahmad'],
            ['okId' => 'ok-tan', 'name' => 'Tan Chee Keong', 'mykad' => '790238-08-6191', 'wirerType' => 'PW3', 'certificateNo' => 'COMP/PW3/2023/00412', 'personaId' => 'p-tan'],
            ['okId' => 'ok-siti-osman', 'name' => 'Siti Aminah binti Osman', 'mykad' => '930627-05-6024', 'wirerType' => 'PW2', 'certificateNo' => 'COMP/PW2/2023/00880'],
            ['okId' => 'ok-ganesan', 'name' => 'Ganesan a/l Muthu', 'mykad' => '760213-10-5093', 'wirerType' => 'PW1', 'certificateNo' => 'COMP/PW1/2019/00440'],
        ];
        // NA-03 demo: Rizal leads confirmation for Tenaga Murni CE draft.
        if ($code === 'rg-ce-10') {
            $tenagaPool = [
                ['okId' => 'ok-rizal', 'name' => 'Rizal bin Hassan', 'mykad' => '870404-10-5512', 'wirerType' => 'PW4', 'certificateNo' => 'COMP/PW4/2023/00644', 'personaId' => 'p-rizal'],
                ['okId' => 'ok-tan', 'name' => 'Tan Chee Keong', 'mykad' => '790238-08-6191', 'wirerType' => 'PW3', 'certificateNo' => 'COMP/PW3/2023/00412', 'personaId' => 'p-tan'],
            ];
        }
        $need = match ($class) {
            'A' => ['PW4', 'PW3', 'PW3', 'PW1', 'PW1'],
            'B' => ['PW4', 'PW3', 'PW1'],
            'C' => ['PW4', 'PW3'],
            'D' => ['PW2'],
            default => ['PW4'],
        };
        $pool = $employerId === 'emp-abc-elektrik' ? $abcPool : $tenagaPool;
        // Only NA-03 keeps the lead OK unconfirmed; NA-04+ marks all accepted.
        $awaitingOk = $status === 'awaiting_employer_confirm';
        $used = [];
        $out = [];
        $leadPersonaSet = false;
        foreach ($need as $i => $wirerType) {
            $src = null;
            foreach ($pool as $candidate) {
                if ($candidate['wirerType'] === $wirerType && ! isset($used[$candidate['okId']])) {
                    $src = $candidate;
                    break;
                }
            }
            if ($src === null) {
                foreach ($pool as $candidate) {
                    if (! isset($used[$candidate['okId']])) {
                        $src = $candidate;
                        break;
                    }
                }
            }
            $src ??= $pool[0];
            $used[$src['okId']] = true;
            $personaId = $src['personaId'] ?? null;
            $isLead = $awaitingOk && $personaId && ! $leadPersonaSet;
            if ($isLead) {
                $leadPersonaSet = true;
            }
            $row = [
                'okId' => $src['okId'].'-'.$code.'-'.$i,
                'registeredOkId' => $src['okId'],
                'name' => $src['name'],
                'mykad' => $src['mykad'],
                'wirerType' => $wirerType,
                'certificateNo' => $src['certificateNo'],
                'periodYears' => 1,
                'employedElsewhere' => false,
                'confirmed' => ! $isLead,
            ];
            if ($personaId) {
                $row['personaId'] = $personaId;
            }
            $out[] = $row;
        }

        return $out;
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
            [
                'code' => 'ent-kg-1',
                'module_code' => 'RG-KG',
                'certificate_no' => 'OK-G/GPE/2024/00155',
                'holder_name' => 'Razak bin Abdullah',
                'identity_no' => '860707-10-9988',
                'category_or_class' => 'GPE',
                'employer_name' => 'GasTech Malaysia Sdn Bhd',
                'registered_at' => $this->daysAgo(300),
                'expires_at' => $this->daysFromNow(80),
                'compliance' => 'active',
                'cdp_points' => 18,
            ],
            [
                'code' => 'ent-kg-2',
                'module_code' => 'RG-KG',
                'certificate_no' => 'OK-G/GJE/2023/00088',
                'holder_name' => 'Chong Mei Ling',
                'identity_no' => '910404-14-5566',
                'category_or_class' => 'GJE',
                'employer_name' => 'Petronas Gas Retail Sdn Bhd',
                'registered_at' => $this->daysAgo(500),
                'expires_at' => $this->daysFromNow(25),
                'compliance' => 'expiring_soon',
                'cdp_points' => 32,
            ],
            [
                'code' => 'ent-cg-1',
                'module_code' => 'RG-CG',
                'certificate_no' => 'CG/G1/2024/00044',
                'holder_name' => 'GasLink Contractors Sdn Bhd',
                'identity_no' => '201701067890 (3344556-W)',
                'category_or_class' => 'G1',
                'registered_at' => $this->daysAgo(280),
                'expires_at' => $this->daysFromNow(70),
                'compliance' => 'active',
                'cdp_points' => 22,
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
