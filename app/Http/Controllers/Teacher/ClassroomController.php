<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Quiz;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index()
    {
        $classrooms = Classroom::where('teacher_id', auth()->id())
                                ->withCount('students')
                                ->with('subject')
                                ->latest()->get();

        return Inertia::render('Teacher/Classrooms/Index', ['classrooms' => $classrooms]);
    }

    public function create()
    {
        return Inertia::render('Teacher/Classrooms/Create', [
            'subjects' => Subject::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'subject_id'  => 'required|exists:subjects,id',
            'grade'       => 'required|integer|min:1|max:12',
            'level'       => 'required|in:SD,SMP,SMA',
            'description' => 'nullable|string',
        ]);

        Classroom::create([
            ...$request->only('name', 'subject_id', 'grade', 'level', 'description'),
            'teacher_id' => auth()->id(),
        ]);

        return redirect()->route('teacher.classrooms.index')->with('success', 'Kelas berhasil dibuat.');
    }

    public function show(Classroom $classroom)
    {
        $classroom->load('students', 'subject');

        $sessions = \App\Models\QuizSession::whereIn(
            'student_id', $classroom->students->pluck('id')
        )->with('quiz', 'student')->latest()->take(20)->get();

        return Inertia::render('Teacher/Classrooms/Show', [
            'classroom' => $classroom,
            'sessions'  => $sessions,
        ]);
    }

    public function edit(Classroom $classroom)
    {
        return Inertia::render('Teacher/Classrooms/Edit', [
            'classroom' => $classroom,
            'subjects'  => Subject::all(),
        ]);
    }

    public function update(Request $request, Classroom $classroom)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'subject_id'  => 'required|exists:subjects,id',
            'grade'       => 'required|integer|min:1|max:12',
            'level'       => 'required|in:SD,SMP,SMA',
            'description' => 'nullable|string',
        ]);

        $classroom->update($request->only('name', 'subject_id', 'grade', 'level', 'description'));

        return redirect()->route('teacher.classrooms.show', $classroom)->with('success', 'Kelas berhasil diupdate.');
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return redirect()->route('teacher.classrooms.index')->with('success', 'Kelas berhasil dihapus.');
    }

    public function assignQuiz(Request $request, Classroom $classroom)
    {
        $request->validate(['quiz_id' => 'required|exists:quizzes,id']);
        // Logika assign kuis ke kelas bisa dikembangkan lebih lanjut
        return back()->with('success', 'Kuis berhasil ditugaskan ke kelas.');
    }

    public function removeStudent(Classroom $classroom, User $student)
    {
        $classroom->students()->detach($student->id);
        return back()->with('success', 'Siswa berhasil dikeluarkan dari kelas.');
    }
}