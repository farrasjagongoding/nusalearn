<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Sudah ditangani langsung lewat kolom role di tabel users
        // Tidak perlu tabel role terpisah karena tidak pakai Spatie
        $this->command->info('Role menggunakan kolom enum di tabel users.');
    }
}