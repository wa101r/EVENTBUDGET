class EventDetail extends Model
{
    protected $fillable = ['event_id', 'key', 'value'];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
