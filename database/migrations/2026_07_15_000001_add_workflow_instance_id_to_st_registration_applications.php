<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('st_registration_applications', function (Blueprint $table) {
            $table->uuid('workflow_instance_id')->nullable()->after('detail');
            $table->index('workflow_instance_id');
        });
    }

    public function down(): void
    {
        Schema::table('st_registration_applications', function (Blueprint $table) {
            $table->dropIndex(['workflow_instance_id']);
            $table->dropColumn('workflow_instance_id');
        });
    }
};
