<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->unique()->after('email');
            $table->string('aspirant_id')->nullable()->after('phone');
            $table->string('target_exam')->default('TNPSC Group 4 & VAO 2024')->after('aspirant_id');
            $table->string('medium')->default('ta')->after('target_exam');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'aspirant_id', 'target_exam', 'medium']);
        });
    }
};
