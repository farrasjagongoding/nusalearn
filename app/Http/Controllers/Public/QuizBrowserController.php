<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizBrowserController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::where('is_public', true)->where('is_active', true);

        if ($request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        if ($request->level) {
            $query->where('level', $request->level);
        }
        if ($request->grade) {
            $query->where('grade', $request->grade);
        }
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $quizzes = $query->with('subject', 'chapter', 'teacher')
                         ->withCount('questions')
                         ->latest()->paginate(12);

        return Inertia::render('Public/Browse', [
            'quizzes'  => $quizzes,
            'subjects' => Subject::all(),
            'filters'  => $request->only('subject_id', 'level', 'grade', 'search'),
        ]);
    }

    public function show(Quiz $quiz)
    {
        abort_if(!$quiz->is_public, 403);
        $quiz->load('questions.options', 'subject', 'chapter', 'teacher');
        return Inertia::render('Public/QuizDetail', ['quiz' => $quiz]);
    }
}