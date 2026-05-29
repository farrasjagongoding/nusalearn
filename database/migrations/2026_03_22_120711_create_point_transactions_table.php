<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            $table->integer('amount');                          // jumlah poin
            $table->string('reason');                           // keterangan
            $table->string('reference_type')->nullable();       // App\Models\QuizSession
            $table->unsignedBigInteger('reference_id')->nullable(); // id sesi kuis
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};