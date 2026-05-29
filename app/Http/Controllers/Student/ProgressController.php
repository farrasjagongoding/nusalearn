<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\QuizSession;
use App\Models\StudentPoint;
use Inertia\Inertia;

class ProgressController extends Controller
{
    public function index()
    {
        $student = auth()->user();

        $point = StudentPoint::where('student_id', $student->id)->first();

        $sessions = QuizSession::where('student_id', $student->id)
                                ->where('status', 'completed')
                                ->with('quiz.subject', 'quiz.chapter')
                                ->latest()->get();

        // Performa per mata pelajaran
        $subjectStats = $sessions->groupBy('quiz.subject.name')
                                ->map(fn($s) => [
                                    'avg_score'  => round($s->avg('score'), 1),
                                    'count'      => $s->count(),
                                    'total_points' => $s->sum('total_points_earned'),
                                ]);

        $badges = $student->badges()->get();

        $pointHistory = $student->pointTransactions()->latest()->take(10)->get();

        return Inertia::render('Student/Progress/Index', [
            'point'        => $point,
            'subjectStats' => $subjectStats,
            'badges'       => $badges,
            'pointHistory' => $pointHistory,
            'totalQuizzes' => $sessions->count(),
            'avgScore'     => round($sessions->avg('score'), 1),
        ]);
    }
}