<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('st_registration_applications', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('module_code');
            $table->string('ref_no')->unique();
            $table->string('app_type');
            $table->string('applicant_name');
            $table->string('identity_no');
            $table->string('category_or_class');
            $table->string('status')->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('stage_entered_at')->nullable();
            $table->unsignedInteger('sla_target_hours')->default(24);
            $table->string('employer_name')->nullable();
            $table->unsignedInteger('cdp_points')->nullable();
            $table->string('assigned_officer')->nullable();
            $table->decimal('fee_amount', 10, 2)->nullable();
            $table->text('note')->nullable();
            $table->json('detail')->nullable();
            $table->timestamps();

            $table->index(['module_code', 'status', 'submitted_at']);
            $table->index(['module_code', 'app_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('st_registration_applications');
    }
};
