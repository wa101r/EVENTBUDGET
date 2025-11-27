<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // 1. ดึงข้อมูลทั้งหมด (สำหรับหน้า List)
    public function index()
    {
        return Event::orderBy('created_at', 'desc')->get();
    }

    // 2. ดึงข้อมูลงานเดียว (สำหรับหน้า Dashboard)
    public function show($id)
    {
        return Event::findOrFail($id);
    }

    // 3. สร้าง Event ใหม่ (แก้ปัญหาปุ่ม Add)
    public function store(Request $request)
    {
        // Validate ข้อมูล
        $validated = $request->validate([
            'name' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'total_budget' => 'nullable|numeric', // เช็คชื่อคอลัมน์ใน DB ให้ดี (total หรือ total_budget)
            'currency_code' => 'nullable|string',
            // ฟิลด์อื่นๆ อนุญาตให้ว่างได้
            'client_name' => 'nullable',
            'venue_name' => 'nullable',
            'country' => 'nullable',
            'description' => 'nullable',
            'client_website' => 'nullable',
            'commended_name' => 'nullable',
            'commended_website' => 'nullable',
            'online_drive' => 'nullable',
        ]);

        // ถ้าใน Form ส่งมาเป็น 'total' แต่ใน DB เป็น 'total_budget' ให้แก้ตรงนี้
        if ($request->has('total') && !isset($validated['total_budget'])) {
            $validated['total_budget'] = $request->input('total');
        }

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    // 4. อัปเดต Event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->update($request->all());
        return response()->json($event);
    }

    // 5. ลบ Event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}