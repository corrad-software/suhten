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
                'role' => 'applicant',
            ],
            [
                'email' => 'ck.tan@email.my',
                'name' => 'Tan Chee Keong',
                'role' => 'applicant',
            ],
            [
                'email' => 'rahman@tenagamurni.com.my',
                'name' => 'Rahman bin Abdullah',
                'role' => 'employer',
            ],
            [
                'email' => 'faridah.hassan@st.gov.my',
                'name' => 'Faridah binti Hassan',
                'role' => 'sos',
            ],
            [
                'email' => 'kumaravel@st.gov.my',
                'name' => 'Kumaravel a/l Subramaniam',
                'role' => 'technical',
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
