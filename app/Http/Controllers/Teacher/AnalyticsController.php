<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\QuizSession;
use App\Models\StudentAnswer;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function show(Classroom $classroom)
    {
        $students = $classroom->students;

        // Performa per siswa
        $studentStats = $students->map(function ($student) use ($classroom) {
            $sessions = QuizSession::where('student_id', $student->id)
                                    ->where('status', 'completed')
                                    ->with('quiz.chapter')
                                    ->get();

            return [
                'student'      => $student->only('id', 'name', 'avatar'),
                'total_quizzes' => $sessions->count(),
                'avg_score'    => round($sessions->avg('score'), 1),
                'total_points' => $sessions->sum('total_points_earned'),
            ];
        });

        // Performa per topik/bab
        $topicStats = QuizSession::whereIn('student_id', $students->pluck('id'))
            ->where('status', 'completed')
            ->with('quiz.chapter')
            ->get()
            ->groupBy('quiz.chapter.name')
            ->map(fn($sessions) => [
                'avg_score' => round($sessions->avg('score'), 1),
                'count'     => $sessions->count(),
            ]);

        return Inertia::render('Teacher/Analytics/Show', [
            'classroom'   => $classroom->load('subject'),
            'studentStats' => $studentStats,
            'topicStats'  => $topicStats,
        ]);
    }
}