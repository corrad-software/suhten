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
        Schema::create('st_registered_entities', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('module_code');
            $table->string('certificate_no')->unique();
            $table->string('holder_name');
            $table->string('identity_no');
            $table->string('category_or_class');
            $table->string('employer_name')->nullable();
            $table->timestamp('registered_at');
            $table->timestamp('expires_at');
            $table->string('compliance')->default('active');
            $table->unsignedInteger('cdp_points')->default(0);
            $table->string('status_label')->nullable();
            $table->timestamps();

            $table->index(['module_code', 'compliance']);
            $table->index(['module_code', 'expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('st_registered_entities');
    }
};
