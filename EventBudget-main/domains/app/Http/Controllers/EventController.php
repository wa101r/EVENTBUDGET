<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Routing\Controller;

class EventController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Event::all()
        ]);
    }

    public function show($id)
    {
        $event = Event::with(['details', 'team'])->findOrFail($id);

        return response()->json($event);
    }

    public function store(Request $request)
{
    $event = Event::create([
        'name' => $request->name,
        'description' => $request->description,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'client_name' => $request->client_name,
        'location' => $request->location,
        'total_budget' => $request->total_budget,
        'venue_name' => $request->venue_name,
        'venue_url' => $request->venue_url,
        'accommodation_name' => $request->accommodation_name,
        'accommodation_url' => $request->accommodation_url,
        'drive_link' => $request->drive_link,
    ]);

    return response()->json(['data' => $event], 201);
}

}
