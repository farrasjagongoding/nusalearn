<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'teacher', 'student'])->default('student')->after('email');
            $table->string('school')->nullable()->after('role');
            $table->string('avatar')->nullable()->after('school');
            $table->string('grade')->nullable()->after('avatar'); // kelas siswa (1-12)
            $table->enum('level_school', ['SD', 'SMP', 'SMA'])->nullable()->after('grade');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'school', 'avatar', 'grade', 'level_school']);
        });
    }
};