<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    // ใส่ชื่อ "คอลัมน์จริงใน DB" เท่านั้น
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'client_name',
        'location',
        'total_budget',
        'venue_name',
        'venue_url',
        'accommodation_name',
        'accommodation_url',
        'drive_link',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date'   => 'date',
    ];
}
