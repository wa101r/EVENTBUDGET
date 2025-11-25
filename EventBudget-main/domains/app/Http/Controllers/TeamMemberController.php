<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TeamMemberController extends Controller
{
    // GET /api/team-members
    public function index()
    {
        return TeamMember::all();
    }

    // GET /api/team-members/{id}
    public function show($id)
    {
        return TeamMember::findOrFail($id);
    }

    // POST /api/team-members
    public function store(Request $request)
    {
        $data = $request->validate([
            'personalname'      => 'nullable|string|max:255',
            'given_name'        => 'nullable|string|max:255',
            'surname'           => 'nullable|string|max:255',
            'given_name_th'     => 'nullable|string|max:255',
            'surname_th'        => 'nullable|string|max:255',
            'passport_no'       => 'nullable|string|max:100',
            'nationality'       => 'nullable|string|max:100',
            'dob'               => 'nullable|date',
            'sex'               => 'nullable|string|max:50',
            'date_issue'        => 'nullable|date',
            'date_expiry'       => 'nullable|date',
            'personal_no'       => 'nullable|string|max:100',
            'issuing_authority' => 'nullable|string|max:255',
            'passport_image'    => 'nullable|string',   // Base64
            'profile_image'     => 'nullable|string',   // Base64
        ]);

        // Save Base64 images
        if (!empty($data['passport_image'])) {
            $data['passport_image'] = $this->saveBase64Image($data['passport_image'], 'passports');
        }

        if (!empty($data['profile_image'])) {
            $data['profile_image'] = $this->saveBase64Image($data['profile_image'], 'profiles');
        }

        return TeamMember::create($data);
    }

    // PUT /api/team-members/{id}
    public function update(Request $request, $id)
    {
        $member = TeamMember::findOrFail($id);

        $data = $request->validate([
            'personalname'      => 'nullable|string|max:255',
            'given_name'        => 'nullable|string|max:255',
            'surname'           => 'nullable|string|max:255',
            'given_name_th'     => 'nullable|string|max:255',
            'surname_th'        => 'nullable|string|max:255',
            'passport_no'       => 'nullable|string|max:100',
            'nationality'       => 'nullable|string|max:100',
            'dob'               => 'nullable|date',
            'sex'               => 'nullable|string|max:50',
            'date_issue'        => 'nullable|date',
            'date_expiry'       => 'nullable|date',
            'personal_no'       => 'nullable|string|max:100',
            'issuing_authority' => 'nullable|string|max:255',
            'passport_image'    => 'nullable|string',   // Base64
            'profile_image'     => 'nullable|string',   // Base64
        ]);

        // Passport Image
        if (!empty($data['passport_image'])) {

            if ($member->passport_image && Storage::disk('public')->exists($member->passport_image)) {
                Storage::disk('public')->delete($member->passport_image);
            }

            $data['passport_image'] = $this->saveBase64Image($data['passport_image'], 'passports');
        }

        // Profile Image
        if (!empty($data['profile_image'])) {

            if ($member->profile_image && Storage::disk('public')->exists($member->profile_image)) {
                Storage::disk('public')->delete($member->profile_image);
            }

            $data['profile_image'] = $this->saveBase64Image($data['profile_image'], 'profiles');
        }

        $member->update($data);
        return $member;
    }

    // DELETE /api/team-members/{id}
    public function destroy($id)
    {
        $member = TeamMember::findOrFail($id);

        if ($member->passport_image && Storage::disk('public')->exists($member->passport_image)) {
            Storage::disk('public')->delete($member->passport_image);
        }

        if ($member->profile_image && Storage::disk('public')->exists($member->profile_image)) {
            Storage::disk('public')->delete($member->profile_image);
        }

        $member->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ============================================
    // 🔹 Base64 → File Helper Function
    // ============================================
    private function saveBase64Image($base64, $folder)
    {
        if (!$base64) return null;

        $image = preg_replace('/^data:image\/\w+;base64,/', '', $base64);
        $image = str_replace(' ', '+', $image);

        $fileName = $folder . '/' . uniqid() . '.png';

        Storage::disk('public')->put($fileName, base64_decode($image));

        return $fileName;
    }
}
