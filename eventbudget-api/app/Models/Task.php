<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    /**
     * รายชื่อคอลัมน์ที่อนุญาตให้แก้ไขได้ (Mass Assignment)
     */
    protected $fillable = [
        'event_id',
        'title',
        'due_date',
        'due_time',
        'is_completed'
    ];

    /**
     * แปลงชนิดข้อมูลอัตโนมัติ (Casting)
     * ช่วยให้เวลาส่งไป Frontend ได้ค่าที่ถูกต้อง (เช่น true/false แทน 1/0)
     */
    protected $casts = [
        'is_completed' => 'boolean', // แปลง 0/1 เป็น false/true อัตโนมัติ
        'due_date' => 'date:Y-m-d',  // จัดรูปแบบวันที่
    ];

    /**
     * ความสัมพันธ์ (Relationship)
     * งานนี้เป็นของ Event ไหน
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}