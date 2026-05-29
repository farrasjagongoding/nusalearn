<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\QuizSession;
use App\Models\StudentPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $student = auth()->user();

        $point = StudentPoint::firstOrCreate(
            ['student_id' => $student->id],
            ['total_points' => 0, 'level' => 1, 'experience' => 0, 'streak_days' => 0]
        );

        $recentSessions = QuizSession::where('student_id', $student->id)
                            ->where('status', 'completed')
                            ->with('quiz.subject')
                            ->latest()->take(5)->get();

        $badges = $student->badges()->latest('student_badges.earned_at')->take(6)->get();

        $classrooms = $student->joinedClassrooms()->with('subject', 'teacher')->get();

        return Inertia::render('Student/Dashboard', [
            'point'          => $point,
            'recentSessions' => $recentSessions,
            'badges'         => $badges,
            'classrooms'     => $classrooms,
        ]);
    }

    public function joinClassroom(Request $request)
    {
        $request->validate(['invite_code' => 'required|string']);

        $classroom = Classroom::where('invite_code', strtoupper($request->invite_code))
                                ->where('is_active', true)
                                ->first();

        if (!$classroom) {
            return back()->withErrors(['invite_code' => 'Kode kelas tidak ditemukan.']);
        }

        $student = auth()->user();

        if ($classroom->students()->where('student_id', $student->id)->exists()) {
            return back()->withErrors(['invite_code' => 'Kamu sudah bergabung di kelas ini.']);
        }

        $classroom->students()->attach($student->id, ['joined_at' => now()]);

        return back()->with('success', 'Berhasil bergabung ke kelas ' . $classroom->name);
    }
}