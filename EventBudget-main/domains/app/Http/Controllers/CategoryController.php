<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        return Category::create([
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color,
        ]);
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);

        $cat->update([
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color,
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy($id)
{
    Category::findOrFail($id)->delete();

    return response()->json([
        'success' => true,
        'message' => 'Category deleted'
    ]);
}

}