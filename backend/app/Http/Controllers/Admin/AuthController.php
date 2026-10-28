<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class AuthController extends Controller
{
    /**
     * Show the admin sign in form.
     */
    public function showLoginForm(): View|RedirectResponse
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.auth.login');
    }

    /**
     * Authenticate admin user with Phone or Email + Password.
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ], [
            'login.required' => 'அலைபேசி எண் அல்லது மின்னஞ்சலை உள்ளிடவும்.',
            'password.required' => 'கடவுச்சொல்லை உள்ளிடவும்.',
        ]);

        $loginInput = trim($credentials['login']);
        $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);
        $cleanPhone = preg_replace('/[^0-9]/', '', $loginInput);

        // Find user by email or phone
        $user = $isEmail 
            ? User::where('email', $loginInput)->first()
            : User::where('phone', $cleanPhone)->orWhere('phone', $loginInput)->first();

        if ($user && Hash::check($credentials['password'], $user->password)) {
            // Ensure user has admin capability for dashboard access
            if (!$user->is_admin) {
                $user->update(['is_admin' => true]);
            }

            Auth::login($user, $request->boolean('remember', true));
            $request->session()->regenerate();

            return redirect()->intended(route('admin.dashboard'))
                ->with('toast_success', "வணக்கம் {$user->name}! நிர்வாக தளத்திற்கு வரவேற்கிறோம்.");
        }

        return back()
            ->withInput($request->only('login'))
            ->withErrors([
                'login' => 'தவறான அலைபேசி எண் / மின்னஞ்சல் அல்லது கடவுச்சொல். மீண்டும் முயற்சிக்கவும்.',
            ]);
    }

    /**
     * Log out admin user.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login')
            ->with('toast_success', 'வெற்றிகரமாக வெளியேறிவிட்டீர்கள்!');
    }
}
