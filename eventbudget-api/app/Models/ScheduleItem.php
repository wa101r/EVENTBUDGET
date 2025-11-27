<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ScheduleItem extends Model
{
    use HasFactory;

    // 👇 เช็คว่าชื่อคอลัมน์ตรงกับ DB ไหม (โดยเฉพาะ start_time, end_time)
    protected $fillable = [
        'event_day_id', 
        'title', 
        'start_time', 
        'end_time', 
        'description', 
        'location', 
        'icon'
    ];
    
    // ความสัมพันธ์ย้อนกลับ (Optional แต่มีไว้ก็ดี)
    public function day()
    {
        return $this->belongsTo(EventDay::class, 'event_day_id');
    }
}