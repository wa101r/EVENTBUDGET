<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\TimelineController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- EVENTS ---
Route::get('/events', [EventController::class, 'index']);
Route::post('/events', [EventController::class, 'store']);
Route::get('/events/{id}', [EventController::class, 'show']); // เพิ่ม show เผื่อดึงรายละเอียด event เดียว
Route::put('/events/{id}', [EventController::class, 'update']);
Route::delete('/events/{id}', [EventController::class, 'destroy']);

// --- CATEGORIES ---
// ใช้ apiResource บรรทัดเดียวจบ (แทนการเขียน get, post, put, delete ทีละอัน)
Route::apiResource('categories', CategoryController::class);

// --- CURRENCIES ---
Route::apiResource('currencies', CurrencyController::class);

// --- TASKS ---
Route::get('/events/{id}/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::put('/tasks/{id}', [TaskController::class, 'update']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);

// --- EXPENSES ---
Route::get('/events/{id}/expenses', [ExpenseController::class, 'index']);
Route::post('/expenses', [ExpenseController::class, 'store']);
Route::put('/expenses/{id}', [ExpenseController::class, 'update']);
Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy']);

// --- Timeline Routes ---
Route::get('/timeline', [TimelineController::class, 'index']);
Route::post('/days', [TimelineController::class, 'storeDay']);
Route::delete('/days/{id}', [TimelineController::class, 'destroyDay']);

Route::post('/items', [TimelineController::class, 'storeItem']);
Route::put('/items/{id}', [TimelineController::class, 'updateItem']);
Route::delete('/items/{id}', [TimelineController::class, 'destroyItem']);