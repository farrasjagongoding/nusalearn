<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('questions', function (Blueprint $table) {
            // Waktu pengerjaan per soal (dalam detik), default 60 detik
            $table->integer('time_limit')->default(60)->after('points'); 
        });
    }
    public function down() {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('time_limit');
        });
    }
};