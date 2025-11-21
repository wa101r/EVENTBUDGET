<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Event::orderBy('start_date', 'desc')->get();
    }

    public function store(Request $request)
{
    $event = new Event();

    $event->name        = $request->input('name');
    $event->description = $request->input('description');
    $event->start_date  = $request->input('start_date');
    $event->end_date    = $request->input('end_date');
    $event->client_name = $request->input('client_name');

    $event->location           = $request->input('country');
    $event->venue_name         = $request->input('venue_name');
    $event->venue_url          = $request->input('client_website');
    $event->accommodation_name = $request->input('commended_name');
    $event->accommodation_url  = $request->input('commended_website');
    $event->drive_link         = $request->input('online_drive');

    // base_total & total_budget
    $baseTotal = $request->input('base_total', $request->input('total'));

    $event->base_total   = $baseTotal;
    $event->total_budget = $baseTotal;

    // currency
    $event->currency_code = strtoupper($request->input('currency_code', 'THB'));

    $event->save();

    return response()->json($event, 201);
}


    public function update(Request $request, $id)
{
    $event = Event::findOrFail($id);

    // ฟิลด์ทั่วไป
    $event->name        = $request->input('name', $event->name);
    $event->description = $request->input('description', $event->description);
    $event->start_date  = $request->input('start_date', $event->start_date);
    $event->end_date    = $request->input('end_date', $event->end_date);
    $event->client_name = $request->input('client_name', $event->client_name);

    // location / venue / อื่น ๆ
    $event->location            = $request->input('country', $event->location);
    $event->venue_name          = $request->input('venue_name', $event->venue_name);
    $event->venue_url           = $request->input('client_website', $event->venue_url);
    $event->accommodation_name  = $request->input('commended_name', $event->accommodation_name);
    $event->accommodation_url   = $request->input('commended_website', $event->accommodation_url);
    $event->drive_link          = $request->input('online_drive', $event->drive_link);

    // -----------------------------
    // ✅ งบประมาณ + สกุลเงินหลักของอีเวนต์
    // -----------------------------

    // ดึง base_total จาก request:
    // ถ้ามี base_total ใช้อันนั้น ถ้าไม่มีก็ fallback ไปที่ total
    $baseTotal = $request->input('base_total', $request->input('total', $event->base_total));

    $event->base_total   = $baseTotal;
    $event->total_budget = $baseTotal; // ถ้ายังอยากให้ total_budget ตาม base_total ไปด้วย

    // currency ต่อ event
    $event->currency_code = strtoupper(
        $request->input('currency_code', $event->currency_code ?? 'THB')
    );

    $event->save();

    return response()->json($event);
}


    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json(null, 204);
    }
}
