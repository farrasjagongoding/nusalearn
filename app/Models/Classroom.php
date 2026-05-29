<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Classroom extends Model
{
    protected $fillable = [
        'teacher_id', 'subject_id', 'name', 'grade',
        'level', 'invite_code', 'is_active', 'description'
    ];

    protected $casts = ['is_active' => 'boolean'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($classroom) {
            $classroom->invite_code = strtoupper(Str::random(8));
        });
    }

    public function teacher() { return $this->belongsTo(User::class, 'teacher_id'); }
    public function subject() { return $this->belongsTo(Subject::class); }
    public function students() { return $this->belongsToMany(User::class, 'classroom_students', 'classroom_id', 'student_id')->withPivot('joined_at'); }
    public function quizSessions() { return $this->hasMany(QuizSession::class); }
}