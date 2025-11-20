<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected $table = 'currencies';

    protected $fillable = [
        'code',
        'name',
        'rate_to_base',
        'is_base_currency',
    ];

    protected $casts = [
        'rate_to_base'     => 'decimal:4',
        'is_base_currency' => 'boolean',
    ];
}
