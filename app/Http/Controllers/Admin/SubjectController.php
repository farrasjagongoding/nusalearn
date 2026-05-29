<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::withCount('chapters')->get();
        return Inertia::render('Admin/Subjects/Index', ['subjects' => $subjects]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subjects/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'level' => 'required|in:SD,SMP,SMA',
            'icon'  => 'nullable|string',
        ]);

        Subject::create($request->only('name', 'level', 'icon'));

        return redirect()->route('admin.subjects.index')->with('success', 'Mata pelajaran berhasil dibuat.');
    }

    public function show(Subject $subject)
    {
        $subject->load('chapters');
        return Inertia::render('Admin/Subjects/Show', ['subject' => $subject]);
    }

    public function edit(Subject $subject)
    {
        $subject->load('chapters');
        return Inertia::render('Admin/Subjects/Edit', ['subject' => $subject]);
    }

    public function update(Request $request, Subject $subject)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'level' => 'required|in:SD,SMP,SMA',
            'icon'  => 'nullable|string',
        ]);

        $subject->update($request->only('name', 'level', 'icon'));

        return redirect()->route('admin.subjects.index')->with('success', 'Mata pelajaran berhasil diupdate.');
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return redirect()->route('admin.subjects.index')->with('success', 'Mata pelajaran berhasil dihapus.');
    }
}