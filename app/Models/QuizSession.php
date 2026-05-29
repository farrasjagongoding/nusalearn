<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizSession extends Model
{
    protected $fillable = [
        'student_id', 'quiz_id', 'classroom_id', 'started_at',
        'submitted_at', 'score', 'duration_taken',
        'total_points_earned', 'status'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
    ];

    public function student() { return $this->belongsTo(User::class, 'student_id'); }
    public function quiz() { return $this->belongsTo(Quiz::class); }
    public function classroom() { return $this->belongsTo(Classroom::class); }
    public function answers() { return $this->hasMany(StudentAnswer::class, 'session_id'); }
}