<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->integer('total_points')->default(0);
            $table->integer('level')->default(1);
            $table->integer('experience')->default(0);          // XP untuk naik level
            $table->integer('streak_days')->default(0);         // streak belajar harian
            $table->date('last_activity_date')->nullable();     // untuk hitung streak
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_points');
    }
};