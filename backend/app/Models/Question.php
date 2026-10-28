<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam',
        'year',
        'paper',
        'topic',
        'question_ta',
        'question_en',
        'options',
        'answer',
        'explanation',
        'source_pdf',
        'review_status',
    ];

    protected $casts = [
        'options' => 'array',
        'year' => 'integer',
    ];

    public function attempts(): HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
