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
    | Staff / applicant mail simulation override
    |--------------------------------------------------------------------------
    |
    | When set, SOS / technical / approver task emails, applicant query
    | (Pertanyaan) emails, and applicant rejection emails are delivered to
    | this address instead of the intended profile/applicant email. Profile
    | emails in the database are left unchanged.
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

    /*
    |--------------------------------------------------------------------------
    | Employer portal ownership (Majikan → syarikat)
    |--------------------------------------------------------------------------
    |
    | Used to scope GET /api/st/registration-applications so an employer
    | representative only sees applications for their organisation.
    |
    */
    'employer_profiles' => [
        'rahman@tenagamurni.com.my' => [
            'persona_id' => 'p-rahman',
            'employer_id' => 'emp-tenaga-murni',
            'organisation' => 'Tenaga Murni Sdn Bhd',
        ],
        'weisheng@elektrikmaju.com.my' => [
            'persona_id' => 'p-lim',
            'employer_id' => 'emp-elektrik-maju',
            'organisation' => 'Syarikat Elektrik Maju Sdn Bhd',
        ],
        'faizal@abcelektrik.com.my' => [
            'persona_id' => 'p-faizal',
            'employer_id' => 'emp-abc-elektrik',
            'organisation' => 'ABC Elektrik Sdn Bhd',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Competent person (OK) portal profiles
    |--------------------------------------------------------------------------
    |
    | Appointed OKs may view/update CE applications they are named on
    | (PFD-RG-CE-NA-03 Menerima Pelantikan).
    |
    */
    'ok_profiles' => [
        'ahmad.ismail@email.my' => [
            'persona_id' => 'p-ahmad',
            'mykad' => '840512-10-5523',
        ],
        'ck.tan@email.my' => [
            'persona_id' => 'p-tan',
            'mykad' => '790238-08-6191',
        ],
        'rizal.hassan@email.my' => [
            'persona_id' => 'p-rizal',
            'mykad' => '870404-10-5512',
        ],
        'nurul.aina.binti.rosli@email.my' => [
            'persona_id' => 'p-nurul',
            'mykad' => '900314-14-5182',
        ],
    ],

];
