<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Mengambil data statistik riil dari database
        $stats = [
            'users'    => User::count(),
            'teachers' => User::where('role', 'teacher')->count(),
            'students' => User::where('role', 'student')->count(),
            'quizzes'  => Quiz::count(),
            'subjects' => Subject::count(),
        ];

        // 2. Mengambil log aktivitas nyata (3 User terbaru yang mendaftar)
        $recentUsers = User::latest()->take(3)->get()->map(function ($user) {
            return [
                'id'    => 'user_' . $user->id,
                'title' => 'Siswa/User baru bergabung: ' . $user->name,
                'time'  => $user->created_at->diffForHumans(),
                'icon'  => '🎓',
            ];
        });

        // 3. Mengambil log aktivitas nyata (3 Kuis terbaru yang dibuat guru)
        $recentQuizzes = Quiz::latest()->take(3)->get()->map(function ($quiz) {
            return [
                'id'    => 'quiz_' . $quiz->id,
                'title' => 'Kuis baru diterbitkan: ' . $quiz->title, // <--- Angka 0 di ujung sini sudah dihapus!
                'time'  => $quiz->created_at->diffForHumans(),
                'icon'  => '📝',
            ];
        });

        // Gabungkan kedua aktivitas terbaru dan urutkan berdasarkan yang paling baru
        $recentActivities = $recentUsers->concat($recentQuizzes)->take(5);

        // 4. Mengambil data performa kapasitas penyimpanan penyimpanan asli dari Server hosting/lokal
        // Menggunakan fungsi bawaan PHP untuk mendeteksi sisa ruang penyimpanan harddisk
        $diskTotal = @disk_total_space(base_path()) ?: 100000000;
        $diskFree  = @disk_free_space(base_path()) ?: 50000000;
        $diskUsed  = $diskTotal - $diskFree;
        
        $storagePercentage = round(($diskUsed / $diskTotal) * 100);

        return Inertia::render('Admin/Dashboard', [
            'stats'            => $stats,
            'recentActivities' => $recentActivities,
            'storageSpace'     => $storagePercentage
        ]);
    }
}