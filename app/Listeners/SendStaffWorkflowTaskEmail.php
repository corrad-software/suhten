<?php

namespace App\Listeners;

use App\Services\StaffWorkflowTaskNotifier;
use SolutionForest\WorkflowEngine\Events\WorkflowWaitingEvent;

class SendStaffWorkflowTaskEmail
{
    public function __construct(
        protected StaffWorkflowTaskNotifier $notifier,
    ) {}

    public function handle(WorkflowWaitingEvent $event): void
    {
        $this->notifier->handle($event);
    }
}
