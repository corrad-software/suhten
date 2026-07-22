<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class ApplicantQueryMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{
     *   ref_no: string|null,
     *   applicant_name: string|null,
     *   module_code: string|null,
     *   note: string,
     *   action_url: string,
     *   intended_email: string|null,
     * }  $payload
     */
    public function __construct(
        public array $payload,
    ) {}

    public function envelope(): Envelope
    {
        $ref = $this->payload['ref_no'] ?? '—';

        return new Envelope(
            subject: "Pertanyaan permohonan: {$ref}",
        );
    }

    public function headers(): Headers
    {
        $ref = $this->payload['ref_no'] ?? 'none';

        return new Headers(
            text: [
                'X-Entity-Ref-ID' => hash('sha256', 'applicant-query|'.$ref.'|'.microtime(true)),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'mail.applicant-query',
            with: [
                'refNo' => $this->payload['ref_no'] ?? '—',
                'applicantName' => $this->payload['applicant_name'] ?? '—',
                'moduleCode' => $this->payload['module_code'] ?? '—',
                'note' => $this->payload['note'],
                'actionUrl' => $this->payload['action_url'],
                'intendedEmail' => $this->payload['intended_email'],
            ],
        );
    }
}
