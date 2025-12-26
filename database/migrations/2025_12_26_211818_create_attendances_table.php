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
        if (Schema::hasTable('attendances')) {
            return;
        }

        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('staff_id')->constrained()->onDelete('cascade');
            // shift_id column created without foreign key constraint (shifts table created later)
            $table->unsignedBigInteger('shift_id')->nullable();
            $table->date('attendance_date');
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->enum('status', ['present', 'absent', 'late', 'half_day', 'leave'])->default('absent');
            $table->integer('hours_worked')->nullable(); // in minutes
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['staff_id', 'attendance_date']);
        });

        // Add foreign key constraint to shifts table if it exists
        if (Schema::hasTable('shifts')) {
            Schema::table('attendances', function (Blueprint $table) {
                $table->foreign('shift_id')->references('id')->on('shifts')->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
