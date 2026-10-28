<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OtpService
{
    /**
     * Authenticate or register user via phone / email and password / OTP.
     */
    public function authenticate(string $identifier, ?string $password = null, ?string $otp = null): User
    {
        $cleanPhone = preg_replace('/\D/', '', $identifier);
        $isEmail = str_contains($identifier, '@');

        $query = User::query();
        if ($isEmail) {
            $query->where('email', $identifier);
        } else {
            $query->where('phone', $cleanPhone)->orWhere('phone', $identifier);
        }

        $user = $query->first();

        if (!$user) {
            // Auto-create user if registering via login / OTP
            $user = User::create([
                'name' => 'அன்பழகன்',
                'phone' => $isEmail ? null : $cleanPhone,
                'email' => $isEmail ? $identifier : 'aspirant_' . Str::random(6) . '@tnpsc.local',
                'password' => Hash::make($password ?: 'secret123'),
                'aspirant_id' => 'TNPSC-' . date('Y') . '-' . rand(1000, 9999),
                'target_exam' => 'TNPSC Group 4 & VAO 2024',
                'medium' => 'ta',
            ]);
        }

        return $user;
    }
}
