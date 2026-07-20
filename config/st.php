<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Frontend base URL (SPA)
    |--------------------------------------------------------------------------
    */
    'frontend_url' => rtrim((string) env('FRONTEND_URL', env('APP_URL', 'http://localhost')), '/'),

    /*
    |--------------------------------------------------------------------------
    | Staff mail simulation override
    |--------------------------------------------------------------------------
    |
    | When set, SOS / technical / approver task emails are delivered to this
    | address instead of the staff user's profile email. Profile emails in
    | the database are left unchanged.
    |
    */
    'staff_mail_override' => env('ST_STAFF_MAIL_OVERRIDE'),

    /*
    |--------------------------------------------------------------------------
    | Registration module → SPA path segment
    |--------------------------------------------------------------------------
    */
    'registration_module_paths' => [
        'RG-KE' => 'registration/ok-electric',
        'RG-KG' => 'registration/ok-gas',
        'RG-CE' => 'registration/contractor-electric',
        'RG-CG' => 'registration/contractor-gas',
    ],

];
