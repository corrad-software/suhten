<?php

namespace App\Services;

use App\Models\StRegistrationApplication;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * Scopes registration applications to the signed-in employer (Majikan)
 * or competent person (OK) appointed on a CE application.
 */
class EmployerRegistrationScope
{
    /**
     * @return array{persona_id: string, employer_id: string, organisation: string}|null
     */
    public function profileFor(User $user): ?array
    {
        if ($user->role !== 'employer') {
            return null;
        }

        $profiles = config('st.employer_profiles', []);
        $key = strtolower((string) $user->email);
        $profile = $profiles[$key] ?? null;

        if (! is_array($profile)) {
            return null;
        }

        $personaId = (string) ($profile['persona_id'] ?? '');
        $employerId = (string) ($profile['employer_id'] ?? '');
        $organisation = (string) ($profile['organisation'] ?? '');

        if ($personaId === '' || $employerId === '' || $organisation === '') {
            return null;
        }

        return [
            'persona_id' => $personaId,
            'employer_id' => $employerId,
            'organisation' => $organisation,
        ];
    }

    /**
     * @return array{persona_id: string, mykad: string}|null
     */
    public function okProfileFor(User $user): ?array
    {
        if ($user->role !== 'applicant') {
            return null;
        }

        $profiles = config('st.ok_profiles', []);
        $key = strtolower((string) $user->email);
        $profile = $profiles[$key] ?? null;

        if (! is_array($profile)) {
            return null;
        }

        $personaId = (string) ($profile['persona_id'] ?? '');
        if ($personaId === '') {
            return null;
        }

        return [
            'persona_id' => $personaId,
            'mykad' => (string) ($profile['mykad'] ?? ''),
        ];
    }

    public function isEmployer(User $user): bool
    {
        return $user->role === 'employer';
    }

    /**
     * Restrict a list query to applications owned by this employer / applicant / appointed OK.
     *
     * @param  Builder<StRegistrationApplication>  $query
     * @return Builder<StRegistrationApplication>
     */
    public function apply(Builder $query, User $user): Builder
    {
        if ($user->role === 'applicant') {
            $email = strtolower(trim((string) $user->email));
            $name = trim((string) $user->name);
            $okProfile = $this->okProfileFor($user);
            $personaId = $okProfile['persona_id'] ?? null;
            $mykad = $okProfile['mykad'] ?? null;

            return $query->where(function (Builder $builder) use ($user, $email, $name, $personaId, $mykad) {
                $builder
                    ->where('detail->email', $user->email)
                    ->orWhere('detail->email', $email);
                if ($name !== '') {
                    $builder->orWhere('applicant_name', $name);
                }
                // CE NA-03: appointed OK can list contractor apps they appear on.
                if ($personaId) {
                    $builder->orWhereJsonContains('detail->ce->appointedOks', ['personaId' => $personaId]);
                }
                if ($mykad) {
                    $builder->orWhereJsonContains('detail->ce->appointedOks', ['mykad' => $mykad]);
                }
                if ($name !== '') {
                    $builder->orWhereJsonContains('detail->ce->appointedOks', ['name' => $name]);
                }
            });
        }

        if (! $this->isEmployer($user)) {
            return $query;
        }

        $profile = $this->profileFor($user);
        if ($profile === null) {
            // Fail closed: unknown employer identity → no rows.
            return $query->whereRaw('1 = 0');
        }

        return $query->where(function (Builder $builder) use ($profile) {
            $org = $profile['organisation'];
            $builder
                ->where('applicant_name', $org)
                ->orWhere('employer_name', $org)
                ->orWhere('detail->employerId', $profile['employer_id'])
                ->orWhere('detail->applicantPersonaId', $profile['persona_id'])
                ->orWhere('detail->ce->companyName', $org);
        });
    }

    public function canAccess(StRegistrationApplication $row, User $user): bool
    {
        if ($user->role === 'applicant') {
            return $this->applicantOwns($row, $user);
        }

        if (! $this->isEmployer($user)) {
            return true;
        }

        $profile = $this->profileFor($user);
        if ($profile === null) {
            return false;
        }

        $detail = is_array($row->detail) ? $row->detail : [];
        $ce = is_array($detail['ce'] ?? null) ? $detail['ce'] : [];

        if (($detail['employerId'] ?? null) === $profile['employer_id']) {
            return true;
        }
        if (($detail['applicantPersonaId'] ?? null) === $profile['persona_id']) {
            return true;
        }
        if (($row->applicant_name ?? null) === $profile['organisation']) {
            return true;
        }
        if (($row->employer_name ?? null) === $profile['organisation']) {
            return true;
        }
        if (($ce['companyName'] ?? null) === $profile['organisation']) {
            return true;
        }

        return false;
    }

    /**
     * Applicants may view/mutate their own OK apps, or CE apps where they are appointed.
     */
    public function applicantOwns(StRegistrationApplication $row, User $user): bool
    {
        $detail = is_array($row->detail) ? $row->detail : [];
        $email = strtolower(trim((string) ($detail['email'] ?? '')));
        $userEmail = strtolower(trim((string) $user->email));

        if ($email !== '' && $email === $userEmail) {
            return true;
        }

        // Fallback when submit omitted detail.email — match identity on known demo users.
        if (strtolower(trim((string) $row->applicant_name)) === strtolower(trim((string) $user->name))) {
            return true;
        }

        return $this->applicantIsAppointedOk($row, $user);
    }

    /**
     * PFD-RG-CE-NA-03 — appointed competent person on a contractor application.
     */
    public function applicantIsAppointedOk(StRegistrationApplication $row, User $user): bool
    {
        if (strtoupper((string) $row->module_code) !== 'RG-CE') {
            return false;
        }

        $detail = is_array($row->detail) ? $row->detail : [];
        $ce = is_array($detail['ce'] ?? null) ? $detail['ce'] : [];
        $oks = $ce['appointedOks'] ?? $ce['appointed_oks'] ?? [];
        if (! is_array($oks) || $oks === []) {
            return false;
        }

        $okProfile = $this->okProfileFor($user);
        $personaId = $okProfile['persona_id'] ?? null;
        $mykad = strtolower(str_replace('-', '', (string) ($okProfile['mykad'] ?? '')));
        $name = strtolower(trim((string) $user->name));

        foreach ($oks as $ok) {
            if (! is_array($ok)) {
                continue;
            }
            $okPersona = (string) ($ok['personaId'] ?? $ok['persona_id'] ?? '');
            if ($personaId && $okPersona === $personaId) {
                return true;
            }
            $okMykad = strtolower(str_replace('-', '', (string) ($ok['mykad'] ?? '')));
            if ($mykad !== '' && $okMykad === $mykad) {
                return true;
            }
            $okName = strtolower(trim((string) ($ok['name'] ?? '')));
            if ($name !== '' && $okName === $name) {
                return true;
            }
        }

        return false;
    }
}
