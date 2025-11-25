<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    protected $fillable = [
        'personalname',
        'given_name',
        'surname',
        'given_name_th',
        'surname_th',
        'passport_no',
        'nationality',
        'dob',
        'sex',
        'date_issue',
        'date_expiry',
        'personal_no',
        'issuing_authority',
        'passport_image',
        'profile_image'
    ];
}
