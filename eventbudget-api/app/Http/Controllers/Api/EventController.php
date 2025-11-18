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

        // ฟิลด์ที่ตรงกันตรง ๆ
        $event->name        = $request->input('name');
        $event->description = $request->input('description');
        $event->start_date  = $request->input('start_date');
        $event->end_date    = $request->input('end_date');
        $event->client_name = $request->input('client_name');

        // map จาก form -> column จริงใน DB
        $event->location        = $request->input('country');          // country ในฟอร์ม → location ใน DB
        $event->total_budget    = $request->input('total');            // total ในฟอร์ม → total_budget
        $event->venue_name      = $request->input('venue_name');       // ตรงชื่อ
        $event->venue_url       = $request->input('client_website');   // website ของ client → venue_url
        $event->accommodation_name = $request->input('commended_name');    // ใช้ commended_* แทน accommodation
        $event->accommodation_url  = $request->input('commended_website');
        $event->drive_link      = $request->input('online_drive');     // online_drive → drive_link

        // ถ้าบางช่องไม่กรอก ก็จะเป็น null ซึ่ง ok เพราะ column อนุญาต NULL อยู่แล้ว
        $event->save();

        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $event->name        = $request->input('name', $event->name);
        $event->description = $request->input('description', $event->description);
        $event->start_date  = $request->input('start_date', $event->start_date);
        $event->end_date    = $request->input('end_date', $event->end_date);
        $event->client_name = $request->input('client_name', $event->client_name);

        $event->location        = $request->input('country', $event->location);
        $event->total_budget    = $request->input('total', $event->total_budget);
        $event->venue_name      = $request->input('venue_name', $event->venue_name);
        $event->venue_url       = $request->input('client_website', $event->venue_url);
        $event->accommodation_name = $request->input('commended_name', $event->accommodation_name);
        $event->accommodation_url  = $request->input('commended_website', $event->accommodation_url);
        $event->drive_link      = $request->input('online_drive', $event->drive_link);

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
