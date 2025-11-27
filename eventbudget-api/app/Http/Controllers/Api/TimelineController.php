<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EventDay;
use App\Models\ScheduleItem;
use Illuminate\Http\Request;

class TimelineController extends Controller
{
    // ดึงข้อมูล Timeline ทั้งหมด
    public function index(Request $request)
    {
        $eventId = $request->query('eventId');
        // ดึงวันเรียงตามวันที่ + ดึงกิจกรรมย่อย (items) มาด้วย
        return EventDay::where('event_id', $eventId)
                        ->with(['items' => function($q) {
                            $q->orderBy('start_time', 'asc');
                        }])
                        ->orderBy('date', 'asc')
                        ->get();
    }

    // เพิ่มวัน
    public function storeDay(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required',
            'date' => 'required|date',
            'title' => 'required',
        ]);
        $day = EventDay::create($validated);
        $day->items = []; // ส่ง array ว่างกลับไปกัน frontend error
        return response()->json($day);
    }

    // ลบวัน
    public function destroyDay($id)
    {
        EventDay::destroy($id);
        return response()->json(null, 204);
    }

    // เพิ่มกิจกรรม
    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'event_day_id' => 'required',
            'title' => 'required',
            'start_time' => 'required',
            'end_time' => 'nullable',
            'description' => 'nullable',
            'location' => 'nullable',
            'icon' => 'nullable',
        ]);
        $item = ScheduleItem::create($validated);
        return response()->json($item);
    }

    // แก้ไขกิจกรรม
    public function updateItem(Request $request, $id)
    {
        $item = ScheduleItem::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    // ลบกิจกรรม
    public function destroyItem($id)
    {
        ScheduleItem::destroy($id);
        return response()->json(null, 204);
    }
}