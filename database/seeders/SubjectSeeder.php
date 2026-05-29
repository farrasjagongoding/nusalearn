<?php

namespace Database\Seeders;

use App\Models\Subject;
use App\Models\Chapter;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            // SD
            ['name' => 'Matematika',  'level' => 'SD', 'icon' => '🔢'],
            ['name' => 'Bahasa Indonesia', 'level' => 'SD', 'icon' => '📖'],
            ['name' => 'IPA',         'level' => 'SD', 'icon' => '🔬'],
            ['name' => 'IPS',         'level' => 'SD', 'icon' => '🌍'],

            // SMP
            ['name' => 'Matematika',  'level' => 'SMP', 'icon' => '🔢'],
            ['name' => 'Bahasa Indonesia', 'level' => 'SMP', 'icon' => '📖'],
            ['name' => 'IPA',         'level' => 'SMP', 'icon' => '🔬'],
            ['name' => 'IPS',         'level' => 'SMP', 'icon' => '🌍'],
            ['name' => 'Bahasa Inggris', 'level' => 'SMP', 'icon' => '🇬🇧'],
            ['name' => 'PKN',         'level' => 'SMP', 'icon' => '🏛️'],

            // SMA
            ['name' => 'Matematika',  'level' => 'SMA', 'icon' => '🔢'],
            ['name' => 'Bahasa Indonesia', 'level' => 'SMA', 'icon' => '📖'],
            ['name' => 'Fisika',      'level' => 'SMA', 'icon' => '⚡'],
            ['name' => 'Kimia',       'level' => 'SMA', 'icon' => '🧪'],
            ['name' => 'Biologi',     'level' => 'SMA', 'icon' => '🧬'],
            ['name' => 'Bahasa Inggris', 'level' => 'SMA', 'icon' => '🇬🇧'],
            ['name' => 'Sejarah',     'level' => 'SMA', 'icon' => '📜'],
            ['name' => 'Ekonomi',     'level' => 'SMA', 'icon' => '💰'],
        ];

        foreach ($subjects as $subjectData) {
            $subject = Subject::create($subjectData);

            // Buat 5 bab default per mapel
            for ($i = 1; $i <= 5; $i++) {
                Chapter::create([
                    'subject_id' => $subject->id,
                    'name'       => "Bab $i",
                    'grade'      => match($subjectData['level']) {
                        'SD'  => rand(1, 6),
                        'SMP' => rand(7, 9),
                        'SMA' => rand(10, 12),
                    },
                    'order' => $i,
                ]);
            }
        }
    }
}