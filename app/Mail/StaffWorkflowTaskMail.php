<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;

class StaffWorkflowTaskMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array{
     *   role: string,
     *   role_label: string,
     *   ref_no: string|null,
     *   applicant_name: string|null,
     *   module_code: string|null,
     *   step_id: string|null,
     *   action_url: string,
     *   intended_name: string|null,
     *   intended_email: string|null,
     * }  $payload
     */
    public function __construct(
        public array $payload,
    ) {}

    public function envelope(): Envelope
    {
        $ref = $this->payload['ref_no'] ?? '—';
        $roleLabel = $this->payload['role_label'] ?? $this->payload['role'];

        // Keep role first so clients don't collapse SOS/Technical/Approver into one thread.
        return new Envelope(
            subject: "Tugasan baharu — {$roleLabel}: {$ref}",
        );
    }

    public function headers(): Headers
    {
        $role = $this->payload['role'] ?? 'staff';
        $ref = $this->payload['ref_no'] ?? 'none';

        return new Headers(
            text: [
                // Helps Gmail/Yahoo treat each role notification as its own conversation.
                'X-Entity-Ref-ID' => hash('sha256', $role.'|'.$ref.'|'.microtime(true)),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'mail.staff-workflow-task',
            with: [
                'role' => $this->payload['role'],
                'roleLabel' => $this->payload['role_label'],
                'refNo' => $this->payload['ref_no'] ?? '—',
                'applicantName' => $this->payload['applicant_name'] ?? '—',
                'moduleCode' => $this->payload['module_code'] ?? '—',
                'stepId' => $this->payload['step_id'] ?? '—',
                'actionUrl' => $this->payload['action_url'],
                'intendedName' => $this->payload['intended_name'],
                'intendedEmail' => $this->payload['intended_email'],
            ],
        );
    }
}
