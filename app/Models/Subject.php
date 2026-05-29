<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name', 'level', 'icon'];

    public function chapters() { return $this->hasMany(Chapter::class); }
    public function quizzes() { return $this->hasMany(Quiz::class); }
}