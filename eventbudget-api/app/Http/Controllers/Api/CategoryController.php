<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // ดึงหมวดหมู่ทั้งหมด
    public function index()
    {
        return Category::orderBy('name')->get();
    }

    // เพิ่มหมวดหมู่
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255', // เก็บ Emoji หรือ Class icon
        ]);

        $cat = Category::create($data);

        return response()->json($cat, 201);
    }

    // แก้ไขหมวดหมู่
    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        $cat->fill($data);
        $cat->save();

        return response()->json($cat);
    }

    // ลบหมวดหมู่
    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json(null, 204);
    }
}