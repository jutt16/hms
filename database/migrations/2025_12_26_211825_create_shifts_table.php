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
        if (Schema::hasTable('shifts')) {
            return;
        }

        Schema::create('shifts', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Morning, Afternoon, Night, etc
            $table->time('start_time');
            $table->time('end_time');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Add foreign key constraint to attendances table if it exists
        if (Schema::hasTable('attendances')) {
            try {
                Schema::table('attendances', function (Blueprint $table) {
                    $table->foreign('shift_id')->references('id')->on('shifts')->onDelete('set null');
                });
            } catch (\Exception $e) {
                // Foreign key might already exist, ignore error
                if (strpos($e->getMessage(), 'Duplicate key name') === false &&
                    strpos($e->getMessage(), 'already exists') === false) {
                    throw $e;
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shifts');
    }
};
