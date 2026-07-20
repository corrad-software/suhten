<?php

namespace Database\Seeders;

use App\Enums\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fullAccess = Permission::all();

        $roles = [
            [
                'name' => 'admin',
                'description' => 'Pentadbir CMS — akses penuh platform',
                'permissions' => $fullAccess,
            ],
            [
                'name' => 'applicant',
                'description' => 'Pemohon — individu atau wakil membuat permohonan',
                'permissions' => [
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_CREATE,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'employer',
                'description' => 'Majikan — pengesahan lantikan Orang Kompeten',
                'permissions' => [
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'sos',
                'description' => 'Pegawai SOS — semakan kelengkapan dokumen',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'technical',
                'description' => 'Pegawai Teknikal — semakan teknikal pematuhan',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'approver',
                'description' => 'Pelulus — kelulusan permohonan mengikut LOA',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'committee',
                'description' => 'Ahli Jawatankuasa — kelulusan peringkat jawatankuasa',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'pentadbir_sistem',
                'description' => 'Pentadbir Sistem — pentadbiran Sistem Digital ST',
                'permissions' => $fullAccess,
            ],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role['name']],
                [
                    'description' => $role['description'],
                    'permissions' => $role['permissions'],
                ]
            );
        }
    }
}
