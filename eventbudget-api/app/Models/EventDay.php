<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventDay extends Model
{
    use HasFactory;

    protected $fillable = ['event_id', 'date', 'title'];

    // 👇 เพิ่มบรรทัดนี้ลงไปครับ! (สั่งปิดการบันทึกเวลา)
    public $timestamps = false;

    public function items()
    {
        return $this->hasMany(ScheduleItem::class, 'event_day_id');
    }
}