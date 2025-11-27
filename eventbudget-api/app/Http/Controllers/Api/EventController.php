<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // 1. ดึงข้อมูล Event ทั้งหมด
    public function index()
    {
        return Event::orderBy('created_at', 'desc')->get();
    }

    // 2. ดึง Event เดียว (หน้า Dashboard)
    public function show($id)
    {
        return Event::findOrFail($id);
    }

    // 3. สร้าง Event ใหม่
    public function store(Request $request)
    {
        $data = $this->mapRequestToEventData($request);
        
        $event = Event::create($data);

        // TODO: ถ้าในอนาคตจะบันทึก Team ให้เขียนโค้ดบันทึกลงตาราง event_teams ตรงนี้
        
        return response()->json($event, 201);
    }

    // 4. อัปเดต Event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        $data = $this->mapRequestToEventData($request);

        $event->update($data);
        
        return response()->json($event);
    }

    // 5. ลบ Event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }

    private function mapRequestToEventData(Request $request)
    {
        $data = $request->except(['team']);

        // Map frontend fields to DB columns
        if ($request->has('country')) {
            $data['location'] = $request->input('country');
        }
        if ($request->has('client_website')) {
            $data['venue_url'] = $request->input('client_website');
        }
        if ($request->has('commended_name')) {
            $data['accommodation_name'] = $request->input('commended_name');
        }
        if ($request->has('commended_website')) {
            $data['accommodation_url'] = $request->input('commended_website');
        }
        if ($request->has('online_drive')) {
            $data['drive_link'] = $request->input('online_drive');
        }
        
        // Ensure total_budget is set if base_total is present (or vice versa if needed)
        // Assuming base_total is the primary source from frontend
        if ($request->has('base_total')) {
             $data['base_total'] = $request->input('base_total');
             $data['total_budget'] = $request->input('base_total'); // Sync to total_budget as well
        }

        return $data;
    }
}