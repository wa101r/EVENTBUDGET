<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;   // 👈 สำคัญ ต้องมี use ตัวนี้
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        // validate ง่าย ๆ
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:255',
        ]);

        // ใช้ mass assign ได้เพราะเราเซ็ต $fillable แล้ว
        $cat = Category::create($data);

        return response()->json($cat, 201);
    }

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

    public function destroy($id)
    {
        $cat = Category::findOrFail($id);
        $cat->delete();

        return response()->json(null, 204);
    }
}
