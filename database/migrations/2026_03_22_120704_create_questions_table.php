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
            $table->foreignId('quiz_id')->constrained()->cascadeOnDelete();
            $table->text('content');                                        // isi soal
            $table->enum('type', ['multiple_choice', 'essay'])->default('multiple_choice');
            $table->text('explanation')->nullable();                        // pembahasan
            $table->tinyInteger('order')->default(1);                       // urutan soal
            $table->integer('points')->default(10);                         // nilai per soal
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};