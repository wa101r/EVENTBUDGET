<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    // 👇 ต้องเพิ่มรายชื่อคอลัมน์ให้ครบตามฟอร์มหน้าเว็บครับ
    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'client_name',
        'client_website',   // เช็คใน DB ว่ามีคอลัมน์นี้ไหม?
        'venue_name',
        'country',          // หรือ location
        'currency_code',
        'total_budget',     // หรือ total
        'commended_name',
        'commended_website',
        'online_drive'
    ];

    // แปลงวันที่อัตโนมัติ
    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'total_budget' => 'decimal:2'
    ];
    
    // ความสัมพันธ์ (ถ้ามี)
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}