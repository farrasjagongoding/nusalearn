<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\StudentPoint;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'name'     => 'Administrator',
            'email'    => 'admin@nusalearn.id',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        // Akun Guru Demo
        User::create([
            'name'         => 'Budi Santoso',
            'email'        => 'guru@nusalearn.id',
            'password'     => Hash::make('password'),
            'role'         => 'teacher',
            'school'       => 'SMP Negeri 1 Jakarta',
            'level_school' => 'SMP',
        ]);

        // Akun Siswa Demo
        $siswa = User::create([
            'name'         => 'Ani Rahayu',
            'email'        => 'siswa@nusalearn.id',
            'password'     => Hash::make('password'),
            'role'         => 'student',
            'school'       => 'SMP Negeri 1 Jakarta',
            'grade'        => '8',
            'level_school' => 'SMP',
        ]);

        // Buat data poin awal untuk siswa
        StudentPoint::create([
            'student_id'  => $siswa->id,
            'total_points' => 0,
            'level'        => 1,
            'experience'   => 0,
            'streak_days'  => 0,
        ]);
    }
}