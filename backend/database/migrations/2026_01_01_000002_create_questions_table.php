<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->string('exam')->default('TNPSC')->index(); // e.g. TNPSC, UPSC, SSC
            $table->integer('year')->nullable()->index(); // e.g. 2023, 2022
            $table->string('paper')->nullable(); // e.g. Group 4, Group 2, VAO
            $table->string('topic')->index(); // e.g. தமிழ் இலக்கியம், இந்திய அரசியல்
            $table->text('question_ta');
            $table->text('question_en')->nullable();
            $table->json('options'); // [{ "id": "A", "label": "அ", "text_ta": "...", "text_en": "..." }]
            $table->string('answer', 10); // A, B, C, D
            $table->text('explanation');
            $table->string('source_pdf')->nullable();
            $table->string('review_status', 20)->default('verified'); // pending, verified, disputed
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
