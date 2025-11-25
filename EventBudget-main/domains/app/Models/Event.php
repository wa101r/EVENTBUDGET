<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
    'name', 'description', 'start_date', 'end_date',
    'client_name', 'location', 'total_budget',
    'venue_name', 'venue_url', 'accommodation_name',
    'accommodation_url', 'drive_link'
];
    public function details()
    {
        return $this->hasMany(EventDetail::class);
    }

    public function team()
    {
        return $this->hasMany(EventTeam::class);
    }
}
