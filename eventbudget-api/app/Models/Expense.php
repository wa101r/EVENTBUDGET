<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'amount',
        'category',
        'date',
        'start_time', // 👈 แก้จาก time เป็น start_time ให้ตรง DB
        'end_time'    // (เผื่อไว้ถ้าจะใช้)
    ];

    // ความสัมพันธ์ (ถ้าจำเป็น)
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}