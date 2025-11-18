<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;   // 👈 เอาตัวในโฟลเดอร์ Api

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ====== EVENT ROUTES ======
Route::get('/events', [EventController::class, 'index']);         // list ทั้งหมด
Route::get('/events/{id}', [EventController::class, 'show']);     // ดูทีละอัน (ถ้าจะใช้ทีหลัง)
Route::post('/events', [EventController::class, 'store']);        // สร้างใหม่
Route::put('/events/{id}', [EventController::class, 'update']);   // แก้ไข
Route::delete('/events/{id}', [EventController::class, 'destroy']); // ลบ
