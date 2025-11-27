<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventDay extends Model
{
    use HasFactory;

    public $timestamps = false; // ตาราง event_days ไม่มี created_at, updated_at ใน SQL ที่ให้มา

    protected $fillable = [
        'event_id',
        'date',
        'title',
        'display_order'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function items()
    {
        return $this->hasMany(ScheduleItem::class, 'event_day_id');
    }
}