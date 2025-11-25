<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::get('/events', [EventController::class, 'index']);  
Route::get('/events/{id}', [EventController::class, 'show']);
Route::apiResource('events', EventController::class);

use App\Http\Controllers\CategoryController;

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::apiResource('categories', CategoryController::class);

use App\Http\Controllers\TeamMemberController;

Route::get('/team-members', [CategoryController::class, 'index']);
Route::get('/team-members/{id}', [CategoryController::class, 'show']);
Route::post('/team-members', [CategoryController::class, 'store']);
Route::put('/team-members/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
Route::apiResource('team-members', CategoryController::class);

