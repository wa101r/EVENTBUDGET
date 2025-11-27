<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    /**
     * 1. ดึงรายการทั้งหมด
     */
    public function index($eventId)
    {
        $expenses = Expense::where('event_id', $eventId)
                           ->orderBy('date', 'desc')
                           ->orderBy('start_time', 'desc') // เรียงตาม start_time
                           ->orderBy('created_at', 'desc')
                           ->get();

        // แปลงข้อมูลก่อนส่งกลับ (เพื่อให้ Frontend เห็นเป็น time เหมือนเดิม)
        $expenses->transform(function ($expense) {
            $expense->time = $expense->start_time; // map กลับไปให้ frontend
            return $expense;
        });

        return response()->json($expenses);
    }

    /**
     * 2. สร้างรายการใหม่
     */
    public function store(Request $request)
    {
        // รับค่า time จาก Frontend
        $validated = $request->validate([
            'event_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
            'category' => 'nullable|string',
            'date' => 'nullable|date',
            'time' => 'nullable', 
        ]);

        // เตรียมข้อมูลบันทึก (แปลง time -> start_time)
        $expenseData = [
            'event_id' => $validated['event_id'],
            'name' => $validated['name'],
            'amount' => $validated['amount'],
            'category' => $validated['category'],
            'date' => $validated['date'],
            'start_time' => $validated['time'] ?? null, // ✅ ใส่ลงช่อง start_time
        ];

        $expense = Expense::create($expenseData);

        return response()->json($expense, 201);
    }

    /**
     * 3. แก้ไขรายการ
     */
    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric',
            'category' => 'nullable|string',
            'date' => 'nullable|date',
            'time' => 'nullable',
        ]);

        // เตรียมข้อมูลอัปเดต
        $updateData = [
            'name' => $validated['name'] ?? $expense->name,
            'amount' => $validated['amount'] ?? $expense->amount,
            'category' => $validated['category'] ?? $expense->category,
            'date' => $validated['date'] ?? $expense->date,
        ];

        // ถ้ามีการส่งเวลามาใหม่ ให้อัปเดต start_time
        if (array_key_exists('time', $validated)) {
            $updateData['start_time'] = $validated['time'];
        }

        $expense->update($updateData);

        return response()->json($expense);
    }

    /**
     * 4. ลบรายการ
     */
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json(null, 204);
    }
}