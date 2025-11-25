<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::orderBy('id', 'desc')->get();
    }

    public function store(Request $request)
    {
        $cat = Category::create($request->only('name', 'icon'));
        return $cat;
    }

    public function update(Request $request, $id)
    {
        $cat = Category::findOrFail($id);
        $cat->update($request->only('name', 'icon'));
        return $cat;
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
