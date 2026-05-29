<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use App\Models\Subject;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class QuizController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        $quizzes = Quiz::where('teacher_id', auth()->id())
                        ->with('subject', 'chapter')
                        ->withCount('questions')
                        ->latest()->paginate(10);

        return Inertia::render('Teacher/Quizzes/Index', ['quizzes' => $quizzes]);
    }

    public function create()
    {
        return Inertia::render('Teacher/Quizzes/Create', [
            'subjects' => Subject::all(),
            'chapters' => Chapter::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'subject_id'  => 'required|exists:subjects,id',
            'chapter_id'  => 'required|exists:chapters,id',
            'grade'       => 'required|integer|min:1|max:12',
            'level'       => 'required|in:SD,SMP,SMA',
            'duration'    => 'required|integer|min:5|max:180',
            'description' => 'nullable|string',
            'is_public'   => 'boolean',
        ]);

        Quiz::create([
            ...$request->only('title', 'subject_id', 'chapter_id', 'grade', 'level', 'duration', 'description', 'is_public'),
            'teacher_id' => auth()->id(),
        ]);

        return redirect()->route('teacher.quizzes.index')->with('success', 'Kuis berhasil dibuat.');
    }

    public function show(Quiz $quiz)
    {
        $this->authorize('view', $quiz);
        $quiz->load('questions.options', 'subject', 'chapter');
        return Inertia::render('Teacher/Quizzes/Show', ['quiz' => $quiz]);
    }

    public function edit(Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        $quiz->load('questions.options');
        return Inertia::render('Teacher/Quizzes/Edit', [
            'quiz'     => $quiz,
            'subjects' => Subject::all(),
            'chapters' => Chapter::all(),
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        $request->validate([
            'title'       => 'required|string|max:255',
            'subject_id'  => 'required|exists:subjects,id',
            'chapter_id'  => 'required|exists:chapters,id',
            'grade'       => 'required|integer|min:1|max:12',
            'level'       => 'required|in:SD,SMP,SMA',
            'duration'    => 'required|integer|min:5|max:180',
            'is_public'   => 'boolean',
        ]);

        $quiz->update($request->only('title', 'subject_id', 'chapter_id', 'grade', 'level', 'duration', 'description', 'is_public'));

        return redirect()->route('teacher.quizzes.show', $quiz)->with('success', 'Kuis berhasil diupdate.');
    }

    public function destroy(Quiz $quiz)
    {
        $this->authorize('delete', $quiz);
        $quiz->delete();
        return redirect()->route('teacher.quizzes.index')->with('success', 'Kuis berhasil dihapus.');
    }

    // Tambah soal ke kuis
    public function storeQuestion(Request $request, Quiz $quiz)
    {
        $this->authorize('update', $quiz);
        $request->validate([
            'content'     => 'required|string',
            'type'        => 'required|in:multiple_choice,essay',
            'explanation' => 'nullable|string',
            'points'      => 'integer|min:1',
            'time_limit'  => 'required|integer|min:5',
            'options'     => 'required_if:type,multiple_choice|array|min:2',
            'options.*.content'    => 'required|string',
            'options.*.is_correct' => 'required|boolean',
            'options.*.label'      => 'required|in:A,B,C,D',
        ]);

        $question = Question::create([
            'quiz_id'     => $quiz->id,
            'content'     => $request->content,
            'type'        => $request->type,
            'explanation' => $request->explanation,
            'points'      => $request->points ?? 10,
            'time_limit'  => $request->time_limit,
            'order'       => $quiz->questions()->count() + 1,
        ]);

        if ($request->type === 'multiple_choice') {
            foreach ($request->options as $opt) {
                Option::create([
                    'question_id' => $question->id,
                    'content'     => $opt['content'],
                    'is_correct'  => $opt['is_correct'],
                    'label'       => $opt['label'],
                ]);
            }
        }

        return back()->with('success', 'Soal berhasil ditambahkan.');
    }

    // Hapus soal
    public function destroyQuestion(Question $question)
    {
        $question->delete();
        return back()->with('success', 'Soal berhasil dihapus.');
    }
    public function updateQuestion(Request $request, Question $question)
    {
        // Validasi
        $request->validate([
            'content'     => 'required|string',
            'explanation' => 'nullable|string',
            'points'      => 'required|integer|min:1',
            'time_limit'  => 'required|integer|min:5',
            'options'     => 'required|array|min:2',
        ]);

        // Update data soal
        $question->update([
            'content'     => $request->content,
            'explanation' => $request->explanation,
            'points'      => $request->points,
            'time_limit'  => $request->time_limit,
        ]);

        // Hapus pilihan jawaban lama, lalu masukkan yang baru dari hasil edit
        $question->options()->delete();
        
        foreach ($request->options as $opt) {
            $question->options()->create([
                'content'    => $opt['content'],
                'label'      => $opt['label'],
                'is_correct' => $opt['is_correct'],
            ]);
        }

        return back()->with('success', 'Soal berhasil diperbarui!');
    }
    // --- FITUR CSV ---

    public function downloadTemplate()
    {
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=Template_Soal_NusaLearn.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['Pertanyaan', 'Poin', 'Waktu(Detik)', 'Opsi_A', 'Opsi_B', 'Opsi_C', 'Opsi_D', 'Jawaban_Benar(A/B/C/D)', 'Pembahasan'];

        $callback = function() use($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            // Contoh isi data
            fputcsv($file, ['Apa ibukota Indonesia?', '10', '60', 'Bandung', 'Jakarta', 'Surabaya', 'Medan', 'B', 'Jakarta adalah ibukota negara Indonesia.']);
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportCsv(Quiz $quiz)
    {
        $fileName = 'Soal_' . preg_replace('/[^A-Za-z0-9\-]/', '_', $quiz->title) . '.csv';
        $questions = $quiz->questions()->with('options')->get();

        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['Pertanyaan', 'Poin', 'Waktu(Detik)', 'Opsi_A', 'Opsi_B', 'Opsi_C', 'Opsi_D', 'Jawaban_Benar(A/B/C/D)', 'Pembahasan'];

        $callback = function() use($questions, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);

            foreach ($questions as $q) {
                $opts = $q->options->keyBy('label');
                $correctLabel = $q->options->where('is_correct', true)->first()->label ?? 'A';

                $row = [
                    $q->content,
                    $q->points,
                    $q->time_limit,
                    $opts['A']->content ?? '',
                    $opts['B']->content ?? '',
                    $opts['C']->content ?? '',
                    $opts['D']->content ?? '',
                    $correctLabel,
                    $q->explanation ?? ''
                ];
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function importCsv(Request $request, Quiz $quiz)
    {
        $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048', // Max 2MB
        ]);

        $file = fopen($request->file('file')->getRealPath(), 'r');
        $header = fgetcsv($file); // Lewati baris pertama (Header)

        while (($row = fgetcsv($file)) !== false) {
            // Pastikan baris tidak kosong
            if (!isset($row[0]) || trim($row[0]) === '') continue;

            $question = $quiz->questions()->create([
                'content'     => $row[0],
                'type'        => 'multiple_choice',
                'points'      => (int) ($row[1] ?? 10),
                'time_limit'  => (int) ($row[2] ?? 60),
                'explanation' => $row[8] ?? null,
                'order'       => $quiz->questions()->count() + 1,
            ]);

            $correctAnswer = strtoupper(trim($row[7] ?? 'A'));

            $optionsData = [
                'A' => $row[3] ?? '',
                'B' => $row[4] ?? '',
                'C' => $row[5] ?? '',
                'D' => $row[6] ?? '',
            ];

            foreach ($optionsData as $label => $content) {
                $question->options()->create([
                    'label'      => $label,
                    'content'    => $content,
                    'is_correct' => ($label === $correctAnswer),
                ]);
            }
        }
        fclose($file);

        return back()->with('success', 'Soal berhasil di-import dari CSV!');
    }
}