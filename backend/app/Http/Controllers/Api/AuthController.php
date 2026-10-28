<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        protected OtpService $otpService
    ) {}

    /**
     * POST /api/auth/login
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'password' => 'nullable|string',
            'otp' => 'nullable|string',
        ]);

        $identifier = $validated['phone'] ?? $validated['email'] ?? null;
        if (!$identifier) {
            throw ValidationException::withMessages([
                'phone' => ['அலைபேசி எண் அல்லது மின்னஞ்சல் முகவரி தேவை.'],
            ]);
        }

        $user = $this->otpService->authenticate(
            $identifier,
            $validated['password'] ?? null,
            $validated['otp'] ?? null
        );

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்',
        ]);
    }

    /**
     * POST /api/auth/register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'password' => 'nullable|string|min:6',
            'target_exam' => 'nullable|string',
            'medium' => 'nullable|string|in:ta,en',
        ]);

        $cleanPhone = !empty($validated['phone']) ? preg_replace('/\D/', '', $validated['phone']) : null;

        // Check if phone or email exists
        if ($cleanPhone && User::where('phone', $cleanPhone)->exists()) {
            $user = User::where('phone', $cleanPhone)->first();
        } elseif (!empty($validated['email']) && User::where('email', $validated['email'])->exists()) {
            $user = User::where('email', $validated['email'])->first();
        } else {
            $user = User::create([
                'name' => $validated['name'],
                'phone' => $cleanPhone,
                'email' => $validated['email'] ?? ('aspirant_' . time() . '@tnpsc.local'),
                'password' => Hash::make($validated['password'] ?? 'secret123'),
                'aspirant_id' => 'TNPSC-' . date('Y') . '-' . rand(1000, 9999),
                'target_exam' => $validated['target_exam'] ?? 'TNPSC Group 4 & VAO 2024',
                'medium' => $validated['medium'] ?? 'ta',
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
            'message' => 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது',
        ], 201);
    }

    /**
     * GET /api/auth/me
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user(),
            'message' => 'சுயவிவர தகவல் பெறப்பட்டது',
        ]);
    }
}
