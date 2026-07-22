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
                'description' => 'Pemohon — individu membuat permohonan Orang Kompeten',
                'permissions' => [
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_CREATE,
                    // Needed so pemohon can persist payment / withdraw status to the API.
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'employer',
                'description' => 'Majikan — pendaftaran Kontraktor Elektrik & pengesahan lantikan Orang Kompeten',
                'permissions' => [
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_CREATE,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'sos',
                'description' => 'Pegawai SOS — OK Elektrik (semakan kelengkapan dokumen)',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'sos_ce',
                'description' => 'Pegawai SOS — Kontraktor Elektrik (semakan kelengkapan dokumen)',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'tp_sos',
                'description' => 'TP SOS — eskalasi SLA & penyerahan semula tugasan SOS',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'technical',
                'description' => 'Pegawai Teknikal — OK Elektrik (semakan teknikal pematuhan)',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'technical_ce',
                'description' => 'Pegawai Teknikal — Kontraktor Elektrik (semakan teknikal pematuhan)',
                'permissions' => [
                    Permission::AUDIT_READ,
                    Permission::REGISTRATION_VIEW,
                    Permission::REGISTRATION_EDIT,
                    Permission::CHAT_USE,
                ],
            ],
            [
                'name' => 'approver',
                'description' => 'Pelulus — kelulusan permohonan mengikut LOA (OK & Kontraktor Elektrik)',
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
