<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function index()
    {
        // ส่งเป็น array ตรง ๆ ก็ได้ หรือห่อใน data ก็ได้
        return response()->json(Currency::all());
        // หรือ
        // return response()->json(['data' => Currency::all()]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'          => 'required|string|max:10',
            'name'          => 'required|string|max:255',
            'rate_to_base'  => 'nullable|numeric',
        ]);

        $currency = Currency::create($data);

        return response()->json($currency, 201);
    }

    public function update(Request $request, Currency $currency)
    {
        $data = $request->validate([
            'code'          => 'required|string|max:10',
            'name'          => 'required|string|max:255',
            'rate_to_base'  => 'nullable|numeric',
        ]);

        $currency->update($data);

        return response()->json($currency);
    }

    public function destroy(Currency $currency)
    {
        $currency->delete();
        return response()->json(null, 204);
    }
}
