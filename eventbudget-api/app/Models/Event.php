<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'client_name',
        'location',
        'total_budget',
        'base_total',
        'currency_code',
        'total_thb',
        'venue_name',
        'venue_url',
        'accommodation_name',
        'accommodation_url',
        'drive_link',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'total_budget' => 'decimal:2',
        'base_total' => 'decimal:2',
        'total_thb' => 'decimal:2',
    ];
    
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}