<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    protected $fillable = [
        'session_id', 'question_id',
        'selected_option_id', 'text_answer', 'is_correct'
    ];

    protected $casts = ['is_correct' => 'boolean'];

    public function session() { return $this->belongsTo(QuizSession::class, 'session_id'); }
    public function question() { return $this->belongsTo(Question::class); }
    public function selectedOption() { return $this->belongsTo(Option::class, 'selected_option_id'); }
}