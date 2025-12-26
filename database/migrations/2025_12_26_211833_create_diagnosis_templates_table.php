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
        Schema::create('diagnosis_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('category')->nullable(); // common, specialty-specific, etc
            $table->text('diagnosis');
            $table->text('symptoms')->nullable();
            $table->text('recommendations')->nullable();
            $table->boolean('is_public')->default(false); // true = available to all doctors
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnosis_templates');
    }
};
