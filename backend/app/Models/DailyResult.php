<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'score',
        'total',
    ];

    protected $casts = [
        'date' => 'date',
        'score' => 'integer',
        'total' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
