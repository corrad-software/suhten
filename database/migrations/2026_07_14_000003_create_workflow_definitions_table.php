<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('workflow_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('version')->default('1.0');
            $table->text('description')->nullable();
            $table->json('definition');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active']);
            $table->index(['name']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workflow_definitions');
    }
};
