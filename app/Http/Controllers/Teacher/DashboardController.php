<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Classroom;
use App\Models\QuizSession;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $teacher = auth()->user();

        return Inertia::render('Teacher/Dashboard', [
            'stats' => [
                'total_quizzes'    => Quiz::where('teacher_id', $teacher->id)->count(),
                'total_classrooms' => Classroom::where('teacher_id', $teacher->id)->count(),
                'total_students'   => Classroom::where('teacher_id', $teacher->id)
                                        ->withCount('students')->get()
                                        ->sum('students_count'),
                'total_sessions'   => QuizSession::whereHas('quiz', fn($q) =>
                                        $q->where('teacher_id', $teacher->id)
                                      )->where('status', 'completed')->count(),
            ],
            'recent_quizzes' => Quiz::where('teacher_id', $teacher->id)
                                    ->with('subject', 'chapter')
                                    ->latest()->take(5)->get(),
            'classrooms' => Classroom::where('teacher_id', $teacher->id)
                                    ->withCount('students')
                                    ->latest()->take(5)->get(),
        ]);
    }
}