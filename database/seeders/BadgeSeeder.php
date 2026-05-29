<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            [
                'name'            => 'Bintang Pertama',
                'description'     => 'Selesaikan kuis pertama kali',
                'icon'            => '⭐',
                'condition_type'  => 'quiz_count',
                'condition_value' => 1,
            ],
            [
                'name'            => 'Nilai Sempurna',
                'description'     => 'Raih skor 100% dalam satu kuis',
                'icon'            => '💯',
                'condition_type'  => 'perfect_score',
                'condition_value' => 1,
            ],
            [
                'name'            => 'Rajin Belajar',
                'description'     => 'Belajar 7 hari berturut-turut',
                'icon'            => '🔥',
                'condition_type'  => 'streak',
                'condition_value' => 7,
            ],
            [
                'name'            => 'Petualang Ilmu',
                'description'     => 'Kerjakan kuis dari 5 mata pelajaran berbeda',
                'icon'            => '🎒',
                'condition_type'  => 'subject_variety',
                'condition_value' => 5,
            ],
            [
                'name'            => '10 Kuis',
                'description'     => 'Selesaikan 10 kuis',
                'icon'            => '🏅',
                'condition_type'  => 'quiz_count',
                'condition_value' => 10,
            ],
            [
                'name'            => '50 Kuis',
                'description'     => 'Selesaikan 50 kuis',
                'icon'            => '🥇',
                'condition_type'  => 'quiz_count',
                'condition_value' => 50,
            ],
            [
                'name'            => 'Cepat & Tepat',
                'description'     => 'Selesaikan kuis dalam 50% waktu dengan skor 90%+',
                'icon'            => '⚡',
                'condition_type'  => 'speed_accuracy',
                'condition_value' => 90,
            ],
            [
                'name'            => 'Level 5',
                'description'     => 'Capai level 5',
                'icon'            => '🚀',
                'condition_type'  => 'level',
                'condition_value' => 5,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}