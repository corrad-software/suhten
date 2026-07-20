<?php

namespace App\Providers;

use App\Listeners\SendStaffWorkflowTaskEmail;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use SolutionForest\WorkflowEngine\Events\WorkflowWaitingEvent;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(WorkflowWaitingEvent::class, SendStaffWorkflowTaskEmail::class);
    }
}
