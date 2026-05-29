<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'teacher_id', 'subject_id', 'chapter_id', 'title',
        'description', 'grade', 'level', 'duration',
        'is_public', 'is_active'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function teacher() { return $this->belongsTo(User::class, 'teacher_id'); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function chapter() { return $this->belongsTo(Chapter::class); }
    public function questions() { return $this->hasMany(Question::class)->orderBy('order'); }
    public function sessions() { return $this->hasMany(QuizSession::class); }
}