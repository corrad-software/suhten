<?php

use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DevelopersGuideController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\StRegisteredEntityController;
use App\Http\Controllers\Api\StaffWorkflowTaskNotifyController;
use App\Http\Controllers\Api\StRegistrationApplicationController;
use App\Http\Controllers\Api\UserChatController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkflowDefinitionController;
use App\Http\Controllers\Api\WorkflowInstanceController;
use App\Http\Controllers\Api\WorkflowTaskController;
use Illuminate\Support\Facades\Route;

// Public routes (no auth)
Route::prefix('public')->group(function () {
    Route::get('/site', [PublicController::class, 'site']);
    Route::get('/pages/frontpage', [PublicController::class, 'frontpage']);
    Route::get('/pages/{slug}', [PublicController::class, 'pageBySlug']);
});

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
        Route::post('/password', [AuthController::class, 'changePassword']);
        Route::post('/avatar', [AuthController::class, 'uploadAvatar']);
        Route::delete('/avatar', [AuthController::class, 'removeAvatar']);
    });
});

// Settings GET is public (used by SPA before auth)
Route::get('/settings', [SettingController::class, 'index']);

// Protected admin routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('pages', PageController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);

    Route::get('/media', [MediaController::class, 'index']);
    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::put('/media/{media}', [MediaController::class, 'update']);
    Route::delete('/media/{media}', [MediaController::class, 'destroy']);

    Route::put('/settings', [SettingController::class, 'update']);
    Route::get('/settings/admin-menu-prefs', [SettingController::class, 'adminMenuPrefs']);
    Route::put('/settings/admin-menu-prefs', [SettingController::class, 'updateAdminMenuPrefs']);
    Route::get('/settings/storefront-menu', [SettingController::class, 'storefrontMenu']);
    Route::put('/settings/storefront-menu', [SettingController::class, 'updateStorefrontMenu']);

    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);

    Route::get('/audit-logs', [AuditLogController::class, 'index']);

    Route::get('/developers-guide', [DevelopersGuideController::class, 'show']);
    Route::put('/developers-guide', [DevelopersGuideController::class, 'update']);

    // ST Registration — Phase 3 (RG-KE / RG-CE first)
    Route::get('/st/registration-applications/by-code/{code}', [StRegistrationApplicationController::class, 'showByCode'])
        ->middleware('permission:registration.view');
    Route::get('/st/registration-applications', [StRegistrationApplicationController::class, 'index'])
        ->middleware('permission:registration.view');
    Route::post('/st/registration-applications', [StRegistrationApplicationController::class, 'store'])
        ->middleware('permission:registration.create');
    Route::get('/st/registration-applications/{id}', [StRegistrationApplicationController::class, 'show'])
        ->middleware('permission:registration.view');
    Route::put('/st/registration-applications/{id}', [StRegistrationApplicationController::class, 'update'])
        ->middleware('permission:registration.edit');
    Route::delete('/st/registration-applications/{id}', [StRegistrationApplicationController::class, 'destroy'])
        ->middleware('permission:registration.delete');

    // Staff task email (SOS / technical / approver) — used by engine events + mock UI transitions
    Route::post('/st/staff-task-notify', [StaffWorkflowTaskNotifyController::class, 'store'])
        ->middleware('permission:registration.edit');
    Route::get('/st/staff-task-notify/{code}', [StaffWorkflowTaskNotifyController::class, 'show'])
        ->middleware('permission:registration.view');

    Route::get('/st/registered-entities', [StRegisteredEntityController::class, 'index'])
        ->middleware('permission:registration.view');
    Route::post('/st/registered-entities', [StRegisteredEntityController::class, 'store'])
        ->middleware('permission:registration.create');
    Route::get('/st/registered-entities/{id}', [StRegisteredEntityController::class, 'show'])
        ->middleware('permission:registration.view');
    Route::put('/st/registered-entities/{id}', [StRegisteredEntityController::class, 'update'])
        ->middleware('permission:registration.edit');
    Route::delete('/st/registered-entities/{id}', [StRegisteredEntityController::class, 'destroy'])
        ->middleware('permission:registration.delete');

    // Workflow configuration + instances (RG-KE → pfd-rg-ke-na, RG-CE → pfd-rg-ce-na on create)
    Route::get('/workflows/catalog', [WorkflowDefinitionController::class, 'catalog']);
    Route::post('/workflows/translate-condition', [WorkflowDefinitionController::class, 'translateCondition']);
    Route::get('/workflows', [WorkflowDefinitionController::class, 'index']);
    Route::post('/workflows', [WorkflowDefinitionController::class, 'store']);
    Route::get('/workflows/{id}', [WorkflowDefinitionController::class, 'show']);
    Route::put('/workflows/{id}', [WorkflowDefinitionController::class, 'update']);
    Route::delete('/workflows/{id}', [WorkflowDefinitionController::class, 'destroy']);
    Route::post('/workflows/{id}/start', [WorkflowDefinitionController::class, 'start']);

    Route::get('/workflow-instances', [WorkflowInstanceController::class, 'index']);
    Route::get('/workflow-instances/{id}', [WorkflowInstanceController::class, 'show']);
    Route::post('/workflow-instances/{id}/cancel', [WorkflowInstanceController::class, 'cancel']);
    Route::post('/workflow-instances/{id}/resume', [WorkflowInstanceController::class, 'resume']);

    Route::get('/workflow-tasks', [WorkflowTaskController::class, 'index']);
    Route::get('/workflow-tasks/{id}', [WorkflowTaskController::class, 'show']);
    Route::post('/workflow-tasks/{id}/claim', [WorkflowTaskController::class, 'claim']);
    Route::post('/workflow-tasks/{id}/complete', [WorkflowTaskController::class, 'complete']);

    // AINA — User Chat (Anthropic)
    Route::middleware(['permission:chat.use', 'user_chat_access'])
        ->prefix('chat/user')
        ->group(function () {
            Route::post('/sessions', [UserChatController::class, 'newUserChatSession']);
            Route::get('/sessions', [UserChatController::class, 'myUserChatSessions']);
            Route::get('/sessions/{id}', [UserChatController::class, 'getUserChatSession']);
            Route::put('/sessions/{id}', [UserChatController::class, 'updateUserChatSession']);
            Route::delete('/sessions/{id}', [UserChatController::class, 'deleteUserChatSession']);
            Route::post('/sessions/{id}/messages', [UserChatController::class, 'sendUserChatMessage']);
            Route::post('/sessions/{id}/favorite', [UserChatController::class, 'toggleUserChatSessionFavorite']);
            Route::get('/sessions/{id}/messages/search', [UserChatController::class, 'searchUserChatMessages']);
            Route::get('/favorites', [UserChatController::class, 'userChatFavorites']);
            Route::post('/messages/{id}/favorite', [UserChatController::class, 'toggleUserChatMessageFavorite']);
            Route::get('/suggestions', [UserChatController::class, 'userChatSuggestions']);
        });
});
