<?php

namespace App\Services;

use SolutionForest\WorkflowEngine\Actions\ConditionAction;
use SolutionForest\WorkflowEngine\Actions\DelayAction;
use SolutionForest\WorkflowEngine\Actions\EmailAction;
use SolutionForest\WorkflowEngine\Actions\HttpAction;
use SolutionForest\WorkflowEngine\Actions\HumanTaskAction;
use SolutionForest\WorkflowEngine\Actions\LogAction;

/**
 * Built-in action palette for the workflow configuration GUI.
 */
class WorkflowCatalog
{
    /**
     * Allowed action identifiers for GUI-authored workflows.
     *
     * @return list<string>
     */
    public static function allowedActionKeys(): array
    {
        return array_column(self::actions(), 'key');
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function actions(): array
    {
        return [
            [
                'key' => 'log',
                'label' => 'Log Message',
                'description' => 'Write a message to the application log',
                'action' => 'log',
                'fields' => [
                    ['key' => 'message', 'label' => 'Message', 'type' => 'text', 'required' => true, 'placeholder' => 'Welcome {{ user.name }}'],
                    ['key' => 'level', 'label' => 'Level', 'type' => 'select', 'required' => false, 'options' => ['debug', 'info', 'warning', 'error'], 'default' => 'info'],
                ],
            ],
            [
                'key' => 'delay',
                'label' => 'Delay',
                'description' => 'Pause workflow execution',
                'action' => 'delay',
                'fields' => [
                    ['key' => 'seconds', 'label' => 'Seconds', 'type' => 'number', 'required' => true, 'default' => 1],
                ],
            ],
            [
                'key' => 'human',
                'label' => 'Human / Approval Task',
                'description' => 'Pause for a staff role decision; creates a Peti Tugasan task',
                'action' => 'human',
                'fields' => [
                    ['key' => 'assign_to_role', 'label' => 'Assign to role', 'type' => 'select', 'required' => true, 'options' => ['sos', 'sos_ce', 'technical', 'technical_ce', 'approver']],
                    ['key' => 'outcomes', 'label' => 'Outcomes (comma-separated)', 'type' => 'text', 'required' => false, 'placeholder' => 'lengkap,kemaskini,ditolak'],
                    // SLA is edited as a first-class step field (sla_target_hours) in the workflow editor.
                    ['key' => 'tab', 'label' => 'Inbox tab', 'type' => 'select', 'required' => false, 'options' => ['new', 'query'], 'default' => 'new'],
                ],
            ],
            [
                'key' => 'email',
                'label' => 'Send Email',
                'description' => 'Send an email (engine mock / integration point)',
                'action' => EmailAction::class,
                'fields' => [
                    ['key' => 'to', 'label' => 'To', 'type' => 'text', 'required' => true, 'placeholder' => '{{ user.email }}'],
                    ['key' => 'subject', 'label' => 'Subject', 'type' => 'text', 'required' => true],
                    ['key' => 'template', 'label' => 'Template', 'type' => 'text', 'required' => false, 'default' => 'default'],
                ],
            ],
            [
                'key' => 'http',
                'label' => 'HTTP Request',
                'description' => 'Call an external HTTP API',
                'action' => HttpAction::class,
                'fields' => [
                    ['key' => 'url', 'label' => 'URL', 'type' => 'text', 'required' => true],
                    ['key' => 'method', 'label' => 'Method', 'type' => 'select', 'required' => false, 'options' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], 'default' => 'GET'],
                ],
            ],
            [
                'key' => 'condition',
                'label' => 'Condition',
                'description' => 'Evaluate a condition against workflow data',
                'action' => ConditionAction::class,
                'fields' => [
                    ['key' => 'condition', 'label' => 'Condition', 'type' => 'text', 'required' => true, 'placeholder' => 'user.plan = premium'],
                ],
            ],
            [
                'key' => 'condition_ai',
                'label' => 'Condition AI',
                'description' => 'Write a condition in natural language; translate with AI to an expression',
                'action' => ConditionAction::class,
                'fields' => [
                    ['key' => 'natural_language', 'label' => 'Natural language', 'type' => 'textarea', 'required' => true, 'placeholder' => 'If the user plan is premium'],
                    ['key' => 'condition', 'label' => 'Condition expression', 'type' => 'text', 'required' => true, 'placeholder' => 'user.plan = premium'],
                ],
            ],
        ];
    }

    /**
     * Resolve GUI action key to engine action value (alias or FQCN).
     */
    public static function resolveAction(string $key): ?string
    {
        foreach (self::actions() as $action) {
            if ($action['key'] === $key) {
                return $action['action'];
            }
        }

        // Allow built-in aliases and known FQCNs directly
        $allowed = [
            'log',
            'delay',
            'human',
            'human_task',
            'approval',
            LogAction::class,
            DelayAction::class,
            HumanTaskAction::class,
            EmailAction::class,
            HttpAction::class,
            ConditionAction::class,
        ];

        return in_array($key, $allowed, true) ? $key : null;
    }
}
