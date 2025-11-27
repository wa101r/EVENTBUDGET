<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * 1. ดึงรายการงานทั้งหมดของ Event นั้นๆ
     * Route: GET /api/events/{id}/tasks
     */
    public function index($eventId)
    {
        // ดึงงานของ event_id นั้นๆ โดยเรียงจากงานที่สร้างล่าสุดขึ้นก่อน
        $tasks = Task::where('event_id', $eventId)
                     ->orderBy('created_at', 'desc')
                     ->get();

        return response()->json($tasks);
    }

    /**
     * 2. สร้างงานใหม่
     * Route: POST /api/tasks
     */
    public function store(Request $request)
    {
        // ตรวจสอบข้อมูลที่ส่งมา
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable', // ✅ รองรับการเก็บเวลา
            'is_completed' => 'boolean'
        ]);

        // ถ้าไม่ได้ส่ง is_completed มา ให้ตั้งเป็น false (ยังไม่เสร็จ)
        if (!isset($validated['is_completed'])) {
            $validated['is_completed'] = false;
        }

        // สร้างข้อมูลลง DB
        // ⚠️ อย่าลืมเพิ่ม 'due_time' ใน $fillable ของไฟล์ App/Models/Task.php ด้วยนะครับ
        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    /**
     * 3. อัปเดตข้อมูลงาน (เช่น ติ๊กถูกว่าทำเสร็จแล้ว, แก้ชื่อ)
     * Route: PUT /api/tasks/{id}
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        // ตรวจสอบเฉพาะค่าที่ส่งมาแก้ไข (sometimes)
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'due_date' => 'nullable|date',
            'due_time' => 'nullable',
            'is_completed' => 'boolean'
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    /**
     * 4. ลบงาน
     * Route: DELETE /api/tasks/{id}
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(null, 204);
    }
}