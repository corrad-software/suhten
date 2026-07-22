<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@example.com')],
            [
                'name' => env('ADMIN_NAME', 'Administrator'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'admin12345')),
                'is_active' => true,
                'role' => 'admin',
                'role_id' => $adminRole->id,
            ]
        );

        $demoPassword = Hash::make('demo1234');

        $stUsers = [
            [
                'email' => 'ahmad.ismail@email.my',
                'name' => 'Ahmad bin Ismail',
                'role' => 'applicant',
            ],
            [
                'email' => 'weisheng@elektrikmaju.com.my',
                'name' => 'Lim Wei Sheng',
                'role' => 'employer',
            ],
            [
                'email' => 'ck.tan@email.my',
                'name' => 'Tan Chee Keong',
                'role' => 'applicant',
            ],
            [
                'email' => 'aisyah.hassan@email.my',
                'name' => 'Nur Aisyah binti Hassan',
                'role' => 'applicant',
            ],
            [
                'email' => 'rizal.hassan@email.my',
                'name' => 'Rizal bin Hassan',
                'role' => 'applicant',
            ],
            [
                'email' => 'farah.karim@email.my',
                'name' => 'Farah binti Karim',
                'role' => 'applicant',
            ],
            [
                'email' => 'rahman@tenagamurni.com.my',
                'name' => 'Rahman bin Abdullah',
                'role' => 'employer',
            ],
            [
                'email' => 'faizal@abcelektrik.com.my',
                'name' => 'Ahmad Faizal bin Omar',
                'role' => 'employer',
            ],
            [
                'email' => 'faridah.hassan@st.gov.my',
                'name' => 'Faridah binti Hassan',
                'role' => 'sos',
            ],
            [
                'email' => 'rosli.ahmad@st.gov.my',
                'name' => 'Rosli bin Ahmad',
                'role' => 'sos',
            ],
            [
                'email' => 'mariam.salleh@st.gov.my',
                'name' => 'Mariam binti Salleh',
                'role' => 'tp_sos',
            ],
            [
                'email' => 'halim.rahim@st.gov.my',
                'name' => 'Halim bin Rahim',
                'role' => 'sos_ce',
            ],
            [
                'email' => 'siti.aminah@st.gov.my',
                'name' => 'Siti Aminah binti Yusof',
                'role' => 'sos_ce',
            ],
            [
                'email' => 'kumaravel@st.gov.my',
                'name' => 'Kumaravel a/l Subramaniam',
                'role' => 'technical',
            ],
            [
                'email' => 'weiming.chong@st.gov.my',
                'name' => 'Chong Wei Ming',
                'role' => 'technical',
            ],
            [
                'email' => 'priya.nair@st.gov.my',
                'name' => 'Priya a/p Nair',
                'role' => 'technical_ce',
            ],
            [
                'email' => 'daniel.lim@st.gov.my',
                'name' => 'Daniel Lim',
                'role' => 'technical_ce',
            ],
            [
                'email' => 'zainab.othman@st.gov.my',
                'name' => 'Ir. Zainab binti Othman',
                'role' => 'approver',
            ],
            [
                'email' => 'noraini@kkr.gov.my',
                'name' => 'Datin Noraini binti Yusof',
                'role' => 'committee',
            ],
            [
                'email' => 'hafiz.kamal@st.gov.my',
                'name' => 'Hafiz bin Kamal',
                'role' => 'pentadbir_sistem',
            ],
        ];

        foreach ($stUsers as $userData) {
            $role = Role::where('name', $userData['role'])->firstOrFail();

            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => $demoPassword,
                    'is_active' => true,
                    'role' => $userData['role'],
                    'role_id' => $role->id,
                ]
            );
        }
    }
}
