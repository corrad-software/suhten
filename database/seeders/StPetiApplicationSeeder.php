<?php

namespace Database\Seeders;

use App\Models\StRegistrationApplication;
use Illuminate\Database\Seeder;

/**
 * Seeds Peti Tugasan mock applications (client/src/st/mock/applications.ts)
 * into st_registration_applications so online submits share the same table.
 *
 * Codes match frontend ids (app-101 …). OK → RG-KE, CE → RG-CE.
 * Refs use ST/RG-KE|RG-CE/2026/00xxx (not ST/OK|CE).
 */
class StPetiApplicationSeeder extends Seeder
{
    private const OFFICERS = [
        'p-faridah' => 'Faridah binti Hassan',
        'p-rosli' => 'Rosli bin Ahmad',
        'p-halim' => 'Halim bin Rahim',
        'p-siti' => 'Siti Aminah binti Yusof',
        'p-kumar' => 'Kumaravel a/l Subramaniam',
        'p-chong' => 'Chong Wei Ming',
        'p-priya' => 'Priya a/p Nair',
        'p-daniel' => 'Daniel Lim',
        'p-zainab' => 'Ir. Zainab binti Othman',
    ];

    private const EMPLOYERS = [
        'emp-tenaga-murni' => 'Tenaga Murni Sdn Bhd',
        'emp-elektrik-maju' => 'Syarikat Elektrik Maju Sdn Bhd',
        'emp-kuasa-bistari' => 'Kuasa Bistari Engineering Sdn Bhd',
        'emp-abc-elektrik' => 'ABC Elektrik Sdn Bhd',
    ];

    private const EMPLOYER_IDS = ['emp-tenaga-murni', 'emp-elektrik-maju', 'emp-kuasa-bistari', 'emp-abc-elektrik'];

    private const OK_CATS = ['PW', 'PE', 'PJ', 'PK', 'JEK', 'JPE'];

    public function run(): void
    {
        foreach ($this->applications() as $row) {
            StRegistrationApplication::updateOrCreate(
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
        $ahmad = $this->person('Ahmad bin Ismail', '840512-10-5523', 41, 'ahmad.ismail@email.my', 'p-ahmad');
        $tan = $this->person('Tan Chee Keong', '790238-08-6191', 47, 'ck.tan@email.my', 'p-tan');
        $lim = $this->person('Lim Wei Sheng', '880920-14-5099', 37, 'weisheng@elektrikmaju.com.my', 'p-lim');
        $faizal = $this->person('Ahmad Faizal bin Omar', '850615-10-5521', 40, 'faizal@abcelektrik.com.my', 'p-faizal');

        $named = [
            $this->row(101, 'OK', 'awaiting_employer_confirm', $ahmad, 'PW', null, 3, 'emp-tenaga-murni', null, 6, 6),
            $this->row(111, 'OK', 'awaiting_employer_confirm', $tan, 'JEK', null, 5, 'emp-kuasa-bistari', null, 2, 2),
            $this->row(112, 'OK', 'awaiting_employer_confirm', $ahmad, 'PK', null, 1, 'emp-tenaga-murni', null, 288, 288),
            $this->row(113, 'OK', 'awaiting_processing_payment', $ahmad, 'PW', null, 3, 'emp-tenaga-murni', null, 1, 5),
            $this->row(114, 'OK', 'awaiting_registration_payment', $tan, 'PE', null, 5, 'emp-kuasa-bistari', null, 1, 90),
            $this->row(103, 'OK', 'sos_review', $tan, 'PE', null, 5, 'emp-kuasa-bistari', null, 1, 26),
            $this->row(104, 'OK', 'sos_review', $tan, 'PW', null, 1, 'emp-kuasa-bistari', null, 3, 28),
            $this->row(105, 'OK', 'sos_review', $ahmad, 'PK', null, 2, 'emp-tenaga-murni', null, 6, 40),
            $this->row(106, 'OK', 'sos_review', $tan, 'PJ', null, 3, 'emp-kuasa-bistari', null, 0.4, 25),
            $this->row(107, 'OK', 'query_applicant', $ahmad, 'PW', null, 4, 'emp-tenaga-murni', null, 5, 36, 'Sijil Kekompetenan tidak jelas'),
            $this->row(108, 'OK', 'technical_review', $tan, 'JEK', null, 5, 'emp-kuasa-bistari', 'p-kumar', 8, 50),
            $this->row(109, 'OK', 'pending_approval', $ahmad, 'PE', null, 3, 'emp-tenaga-murni', 'p-zainab', 2, 60),
            $this->row(110, 'OK', 'certificate_issued', $ahmad, 'PW', null, 5, 'emp-tenaga-murni', null, 1, 90),
            $this->row(202, 'CE', 'sos_review', $lim, null, 'B', 2, 'emp-elektrik-maju', null, 2.5, 20),
            $this->row(203, 'CE', 'technical_review', $faizal, null, 'B', 3, 'emp-abc-elektrik', 'p-priya', 4, 45),
            $this->row(204, 'CE', 'sos_review', $faizal, null, 'A', 2, 'emp-abc-elektrik', null, 1.5, 18),
        ];

        $volume = [
            $this->mk(301, 'pending_approval', 0, 'OK', 'PW', null, 'p-zainab', 1, 62),
            $this->mk(302, 'pending_approval', 1, 'OK', 'PE', null, 'p-zainab', 3, 70),
            $this->mk(303, 'pending_approval', 2, 'OK', 'PJ', null, 'p-zainab', 5, 74),
            $this->mk(304, 'pending_approval', 3, 'OK', 'JEK', null, 'p-zainab', 6.5, 80),
            $this->mk(305, 'pending_approval', 4, 'OK', 'PK', null, 'p-zainab', 9, 92),
            $this->mk(306, 'pending_approval', 5, 'CE', null, 'A', 'p-zainab', 2, 66),

            $this->mk(311, 'technical_review', 6, 'OK', 'PW', null, 'p-kumar', 4, 40),
            $this->mk(312, 'technical_review', 7, 'OK', 'JPE', null, 'p-chong', 14, 52),
            $this->mk(313, 'technical_review', 8, 'OK', 'PE', null, 'p-kumar', 19, 58),
            $this->mk(314, 'technical_review', 9, 'OK', 'PJ', null, null, 27, 66),
            $this->mk(317, 'technical_review', 1, 'OK', 'PW', null, null, 6, 42),
            $this->mk(318, 'technical_review', 2, 'OK', 'JEK', null, null, 10, 48),
            $this->mk(315, 'technical_review', 10, 'CE', null, 'D', 'p-priya', 8, 44),
            $this->mk(316, 'technical_review', 11, 'CE', null, 'C', 'p-daniel', 12, 50),
            $this->mk(319, 'technical_review', 3, 'CE', null, 'B', null, 5, 40),

            $this->mk(321, 'sos_review', 11, 'OK', 'PW', null, 'p-faridah', 0.6, 24),
            $this->mk(322, 'sos_review', 0, 'OK', 'PK', null, 'p-rosli', 1.4, 26),
            $this->mk(323, 'sos_review', 1, 'OK', 'PE', null, null, 2.8, 28),
            $this->mk(324, 'sos_review', 2, 'OK', 'JEK', null, null, 3.6, 30),
            $this->mk(325, 'sos_review', 3, 'OK', 'PJ', null, null, 5.5, 34),
            $this->mk(326, 'sos_review', 4, 'CE', null, 'B', 'p-halim', 7.2, 38),
            $this->mk(327, 'sos_review', 5, 'CE', null, 'A', 'p-siti', 3.1, 36),
            $this->mk(328, 'sos_review', 6, 'CE', null, 'D', null, 1.2, 22),

            $this->mk(331, 'awaiting_processing_payment', 5, 'OK', 'PW', null, null, 3, 12),
            $this->mk(332, 'awaiting_processing_payment', 6, 'CE', null, 'C', null, 20, 30),
            $this->mk(333, 'awaiting_registration_payment', 7, 'OK', 'PE', null, null, 6, 96),
            $this->mk(334, 'awaiting_registration_payment', 8, 'OK', 'PW', null, null, 30, 120),
            $this->mk(335, 'query_applicant', 9, 'OK', 'PJ', null, null, 18, 48, 'Maklumat tambahan diperlukan'),

            $this->mk(341, 'certificate_issued', 10, 'OK', 'PW', null, null, 2, 130),
            $this->mk(342, 'certificate_issued', 11, 'OK', 'JEK', null, null, 20, 150),
            $this->mk(343, 'certificate_issued', 0, 'CE', null, 'B', null, 44, 170),
            $this->mk(344, 'rejected', 1, 'OK', 'PK', null, null, 8, 100, 'Tidak memenuhi syarat semakan'),
            $this->mk(345, 'rejected', 2, 'CE', null, 'D', null, 52, 140, 'Dokumen tidak lengkap'),
        ];

        return array_merge($named, $volume);
    }

    /**
     * @return array{name: string, ic: string, age: int, email: string, personaId: string}
     */
    private function person(string $name, string $ic, int $age, string $email, string $personaId): array
    {
        return compact('name', 'ic', 'age', 'email', 'personaId');
    }

    /**
     * @return array{name: string, ic: string, age: int, email: string, personaId: string}
     */
    private function extra(int $who): array
    {
        $pool = [
            ['Nurul Aina binti Rosli', '900314-14-5182', 36],
            ['Sivakumar a/l Rajan', '830722-08-5461', 43],
            ['Mohd Hafiz bin Zulkifli', '870105-03-5237', 39],
            ['Lee Chong Wei', '810918-07-5119', 45],
            ['Siti Aminah binti Osman', '930627-05-6024', 33],
            ['Ganesan a/l Muthu', '760213-10-5093', 50],
            ['Wong Kah Meng', '890430-01-5771', 37],
            ['Abdul Rahim bin Salleh', '680809-02-5315', 58],
            ['Chan Mei Fong', '920115-14-6248', 34],
            ['Zulkarnain bin Mat Noor', '850526-11-5602', 41],
            ['Prakash a/l Subramaniam', '780304-06-5427', 48],
            ['Nor Azlina binti Hamid', '910908-12-5990', 35],
        ];
        [$name, $ic, $age] = $pool[$who % count($pool)];
        $slug = strtolower((string) preg_replace('/[^a-z]+/i', '.', $name));
        $slug = trim($slug, '.');

        return $this->person($name, $ic, $age, $slug.'@email.my', 'p-ext-'.str_pad((string) (($who % 12) + 1), 2, '0', STR_PAD_LEFT));
    }

    /**
     * @param  array{name: string, ic: string, age: int, email: string, personaId: string}  $person
     * @return array<string, mixed>
     */
    private function row(
        int $ref,
        string $type,
        string $status,
        array $person,
        ?string $cat,
        ?string $cls,
        int $period,
        string $employerId,
        ?string $assigneePersonaId,
        float $stageHoursAgo,
        float $createdHoursAgo,
        ?string $note = null,
    ): array {
        $module = $type === 'CE' ? 'RG-CE' : 'RG-KE';
        $code = 'app-'.$ref;
        $employerName = self::EMPLOYERS[$employerId] ?? 'Tenaga Murni Sdn Bhd';
        $category = $type === 'CE' ? ($cls ?? 'C') : ($cat ?? 'PW');
        $officer = $assigneePersonaId ? (self::OFFICERS[$assigneePersonaId] ?? null) : null;
        $sla = match ($status) {
            'sos_review' => 4,
            'technical_review' => 24,
            'pending_approval' => 8,
            'awaiting_employer_confirm' => 336,
            'query_applicant' => 48,
            default => 72,
        };
        $fee = $type === 'CE' ? 100.0 : 50.0;
        if (in_array($status, ['awaiting_employer_confirm', 'awaiting_processing_payment'], true)) {
            // still unpaid processing in some cases — keep fee as expected amount
        }
        if ($status === 'certificate_issued' && $type === 'OK') {
            $fee = 500.0;
        }

        $submitted = $this->hoursAgo($createdHoursAgo);
        $stage = $this->hoursAgo($stageHoursAgo);

        $detail = [
            'age' => $person['age'],
            'gender' => 'male',
            'email' => $person['email'],
            'phone' => '012-3456789',
            'periodYears' => $period,
            'employerCategory' => 'company',
            'employerId' => $employerId,
            'applicantPersonaId' => $person['personaId'],
            'assigneePersonaId' => $assigneePersonaId,
            'workflowType' => $type,
            'source' => 'peti_mock',
            'timeline' => [
                ['at' => $submitted, 'label' => 'Permohonan dihantar', 'actor' => $person['name']],
                ['at' => $stage, 'label' => 'Status: '.$status, 'actor' => $officer ?? 'Sistem'],
            ],
        ];

        if ($type === 'OK') {
            $detail['certificate'] = [
                'certificateNo' => 'COMP/'.$category.'/2024/'.str_pad((string) $ref, 3, '0', STR_PAD_LEFT),
                'category' => $category,
                'voltageRestriction' => 'lv',
                'placeRestriction' => 'none',
                'active' => true,
                'suspended' => false,
            ];
            $detail['documents'] = [
                ['label' => 'Salinan MyKad', 'fileName' => 'mykad.pdf'],
                ['label' => 'Sijil Kekompetenan', 'fileName' => 'sijil-kekompetenan.pdf'],
                ['label' => 'Gambar passport', 'fileName' => 'passport.jpg'],
            ];
        } else {
            $detail['documents'] = [
                ['label' => 'Sijil pendaftaran SSM / Borang 9', 'fileName' => 'ssm-borang-9.pdf'],
                ['label' => 'Borang 49 / senarai pengarah', 'fileName' => 'borang-49.pdf'],
                ['label' => 'Surat lantikan Orang Kompeten', 'fileName' => 'surat-lantikan-ok.pdf'],
                ['label' => 'Foto premis / operasi', 'fileName' => 'foto-premis.jpg'],
                ['label' => 'Senarai peralatan menguji', 'fileName' => 'senarai-peralatan.pdf'],
            ];
            $detail['ce'] = $this->ceDetail(
                $ref,
                $category,
                $period,
                $person,
                $employerId,
                $employerName,
            );
        }

        if ($status === 'certificate_issued') {
            $refTail = str_pad((string) $ref, 5, '0', STR_PAD_LEFT);
            $serial = 'ST-'.$type.'-2026-'.$refTail;
            $detail['issuedCertificate'] = [
                'id' => 'cert-app-'.$ref,
                'serialNo' => $serial,
                'applicationId' => $code,
                'holderName' => $type === 'CE' ? $employerName : $person['name'],
                'competencyCategory' => $type === 'OK' ? $category : null,
                'contractorClass' => $type === 'CE' ? $category : null,
                'issuedAt' => $stage,
                'expiresAt' => now()->addYears($period)->toIso8601String(),
                'qrPayload' => 'https://verify.st.gov.my/cert/'.$serial,
                'trustmarkId' => 'ST-TRUST-'.$refTail,
            ];
        }

        return [
            'code' => $code,
            'module_code' => $module,
            'ref_no' => 'ST/'.$module.'/2026/'.str_pad((string) $ref, 5, '0', STR_PAD_LEFT),
            'app_type' => 'new_registration',
            'applicant_name' => $type === 'CE' ? $employerName : $person['name'],
            'identity_no' => $type === 'CE'
                ? ($this->employerProfile($employerId)['registration_no'] ?? '2011010'.str_pad((string) $ref, 5, '0', STR_PAD_LEFT))
                : $person['ic'],
            'category_or_class' => $category,
            'status' => $status,
            'submitted_at' => $submitted,
            'stage_entered_at' => $stage,
            'sla_target_hours' => $sla,
            'employer_name' => $employerName,
            'cdp_points' => 12,
            'assigned_officer' => $officer,
            'fee_amount' => $fee,
            'note' => $note,
            'detail' => $detail,
        ];
    }

    /**
     * @return array{registration_no: string, address: string, city: string, state: string, postcode: string, phone: string, fax: string, email: string}
     */
    private function employerProfile(string $employerId): array
    {
        return match ($employerId) {
            'emp-tenaga-murni' => [
                'registration_no' => '200801012345 (812345-A)',
                'address' => 'No. 12, Jalan Perindustrian 4',
                'city' => 'Shah Alam',
                'state' => 'Selangor',
                'postcode' => '40000',
                'phone' => '03-5511 2233',
                'fax' => '03-5511 2244',
                'email' => 'hr@tenagamurni.com.my',
            ],
            'emp-elektrik-maju' => [
                'registration_no' => '201101023456 (945678-K)',
                'address' => 'Lot 8, Jalan Teknologi 3/5',
                'city' => 'Petaling Jaya',
                'state' => 'Selangor',
                'postcode' => '47810',
                'phone' => '03-7788 4455',
                'fax' => '03-7788 4466',
                'email' => 'info@elektrikmaju.com.my',
            ],
            'emp-kuasa-bistari' => [
                'registration_no' => '201501034567 (1134567-P)',
                'address' => 'No. 5, Persiaran Bukit',
                'city' => 'Johor Bahru',
                'state' => 'Johor',
                'postcode' => '81100',
                'phone' => '07-2233 6677',
                'fax' => '07-2233 6688',
                'email' => 'admin@kuasabistari.com.my',
            ],
            'emp-abc-elektrik' => [
                'registration_no' => '201901089012 (1289012-H)',
                'address' => 'No. 18, Jalan Industri USJ 1',
                'city' => 'Subang Jaya',
                'state' => 'Selangor',
                'postcode' => '47600',
                'phone' => '03-8023 1188',
                'fax' => '03-8023 1199',
                'email' => 'info@abcelektrik.com.my',
            ],
            default => [
                'registration_no' => '201101000000 (000000-X)',
                'address' => 'Lot 1, Jalan Industri',
                'city' => 'Shah Alam',
                'state' => 'Selangor',
                'postcode' => '40000',
                'phone' => '03-1234 5678',
                'fax' => '03-1234 5679',
                'email' => 'info@syarikat.my',
            ],
        };
    }

    /**
     * Full CE Bahagian A–F sample payload for detail screens.
     *
     * @param  array{name: string, ic: string, age: int, email: string, personaId: string}  $person
     * @return array<string, mixed>
     */
    private function ceDetail(
        int $ref,
        string $class,
        int $period,
        array $person,
        string $employerId,
        string $employerName,
    ): array {
        $profile = $this->employerProfile($employerId);
        $suffix = str_pad((string) $ref, 3, '0', STR_PAD_LEFT);
        $voltage = $class === 'A' ? '33kV' : '415V';

        return [
            'contractorKind' => 'electrical',
            'contractorClass' => $class,
            'voltage' => $voltage,
            'representativeName' => $person['name'],
            'representativeIc' => $person['ic'],
            'companyName' => $employerName,
            'companyRegNo' => $profile['registration_no'],
            'companyAddress' => $profile['address'],
            'postcode' => $profile['postcode'],
            'city' => $profile['city'],
            'state' => $profile['state'],
            'companyEmail' => $profile['email'],
            'companyPhone' => $profile['phone'],
            'companyFax' => $profile['fax'],
            'directors' => [
                [
                    'id' => 'dir-app-'.$ref,
                    'name' => $person['name'],
                    'icNumber' => $person['ic'],
                    'address' => $profile['address'].', '.$profile['postcode'].' '.$profile['city'].', '.$profile['state'],
                    'sharePercent' => 60,
                ],
                [
                    'id' => 'dir-app-'.$ref.'-b',
                    'name' => match ($employerId) {
                        'emp-tenaga-murni' => 'Rahman bin Abdullah',
                        'emp-elektrik-maju' => 'Lim Wei Sheng',
                        'emp-kuasa-bistari' => 'Goh Mei Ling',
                        'emp-abc-elektrik' => 'Ahmad Faizal bin Omar',
                        default => 'Pengarah Contoh',
                    },
                    'icNumber' => match ($employerId) {
                        'emp-tenaga-murni' => '750101-10-5432',
                        'emp-elektrik-maju' => '880920-14-5099',
                        'emp-kuasa-bistari' => '820505-01-5566',
                        'emp-abc-elektrik' => '850615-10-5521',
                        default => '800101-10-5000',
                    },
                    'address' => $profile['address'].', '.$profile['postcode'].' '.$profile['city'].', '.$profile['state'],
                    'sharePercent' => 40,
                ],
            ],
            'appointedOks' => $this->appointedOksForClass($class, $period, $ref, $employerId),
            'skilledPersons' => [],
            'professionalEngineers' => [],
            'equipment' => [
                [
                    'id' => 'eq-app-'.$ref.'-1',
                    'equipmentType' => 'insulation_tester',
                    'serialNo' => 'INS-2024-'.$suffix,
                    'brand' => 'fluke',
                    'model' => '1507',
                ],
                [
                    'id' => 'eq-app-'.$ref.'-2',
                    'equipmentType' => 'earth_tester',
                    'serialNo' => 'EAR-2024-'.$suffix,
                    'brand' => 'megger',
                    'model' => 'DET3TD',
                ],
                [
                    'id' => 'eq-app-'.$ref.'-3',
                    'equipmentType' => 'multimeter',
                    'serialNo' => 'DMM-2024-'.$suffix,
                    'brand' => 'fluke',
                    'model' => '87V',
                ],
            ],
            'confirmationChecks' => ['class_ok', 'company_ok', 'ok_ok', 'equip_ok', 'docs_ok'],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function appointedOksForClass(string $class, int $period, int $ref, string $employerId = ''): array
    {
        $need = match ($class) {
            'A' => ['PW4' => 1, 'PW3' => 2, 'PW1' => 2],
            'B' => ['PW4' => 1, 'PW3' => 1, 'PW1' => 1],
            'C' => ['PW4' => 1, 'PW3' => 1],
            default => ['PW2' => 1],
        };
        // Ahmad / Tan reserved for Tenaga Murni; ABC and others use alternate pool.
        $pool = $employerId === 'emp-abc-elektrik'
            ? [
                'PW4' => [
                    ['name' => 'Rizal bin Hassan', 'mykad' => '870404-10-5512'],
                ],
                'PW3' => [
                    ['name' => 'Suresh a/l Maniam', 'mykad' => '880101-14-5099'],
                    ['name' => 'Lim Mei Ling', 'mykad' => '900818-14-5220'],
                ],
                'PW2' => [
                    ['name' => 'Mohd Faizal bin Yusof', 'mykad' => '910722-05-5331'],
                ],
                'PW1' => [
                    ['name' => 'Azman bin Rahim', 'mykad' => '830909-12-5443'],
                    ['name' => 'Vimala a/p Krishnan', 'mykad' => '920215-08-5688'],
                ],
            ]
            : [
                'PW4' => [
                    ['name' => 'Ahmad bin Ismail', 'mykad' => '840512-10-5523'],
                ],
                'PW3' => [
                    ['name' => 'Tan Chee Keong', 'mykad' => '790238-08-6191'],
                ],
                'PW2' => [
                    ['name' => 'Siti Aminah binti Osman', 'mykad' => '930627-05-6024'],
                ],
                'PW1' => [
                    ['name' => 'Ganesan a/l Muthu', 'mykad' => '760213-10-5093'],
                    ['name' => 'Chong Wei Liang', 'mykad' => '860318-07-5217'],
                ],
            ];
        $out = [];
        $i = 0;
        foreach ($need as $wirer => $count) {
            $candidates = $pool[$wirer] ?? [['name' => 'OK Contoh', 'mykad' => '800101-10-5000']];
            for ($n = 0; $n < $count; $n++) {
                $src = $candidates[$n % count($candidates)];
                $out[] = [
                    'okId' => 'ok-app-'.$ref.'-'.$i,
                    'name' => $src['name'],
                    'mykad' => $src['mykad'],
                    'wirerType' => $wirer,
                    'certificateNo' => 'OK-E/'.$wirer.'/2024/'.str_pad((string) ($ref + $i), 5, '0', STR_PAD_LEFT),
                    'periodYears' => $period,
                    'employedElsewhere' => false,
                ];
                $i++;
            }
        }

        return $out;
    }

    /**
     * @return array<string, mixed>
     */
    private function mk(
        int $ref,
        string $status,
        int $who,
        string $type,
        ?string $cat,
        ?string $cls,
        ?string $assignee,
        float $stageHoursAgo,
        float $createdHoursAgo,
        ?string $note = null,
    ): array {
        $person = $this->extra($who);
        $employerId = self::EMPLOYER_IDS[$who % count(self::EMPLOYER_IDS)];
        $period = 1 + ($who % 5);
        $okCat = $cat ?? self::OK_CATS[$who % count(self::OK_CATS)];

        return $this->row(
            $ref,
            $type,
            $status,
            $person,
            $type === 'OK' ? $okCat : null,
            $type === 'CE' ? ($cls ?? 'C') : null,
            $period,
            $employerId,
            $assignee,
            $stageHoursAgo,
            $createdHoursAgo,
            $note,
        );
    }

    private function hoursAgo(float $hours): string
    {
        return now()->subMinutes((int) round($hours * 60))->toIso8601String();
    }
}
