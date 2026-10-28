<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Streak;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Super Admin User
        $admin1 = User::updateOrCreate(
            ['phone' => '8525897626'],
            [
                'name' => 'Veeramani Rajkumar',
                'email' => 'veeramani@tnpsc.local',
                'password' => Hash::make('password123'),
                'aspirant_id' => 'TNPSC-2026-2634',
                'target_exam' => 'Group 2 & 2A',
                'medium' => 'ta',
                'is_admin' => true,
            ]
        );
        Streak::firstOrCreate(['user_id' => $admin1->id], ['current' => 7, 'best' => 14]);

        // 2. Evaluator Admin User
        $admin2 = User::updateOrCreate(
            ['phone' => '9842173650'],
            [
                'name' => 'மதிப்பாய்வாளர் (Admin)',
                'email' => 'admin@tnpsc.local',
                'password' => Hash::make('password123'),
                'aspirant_id' => 'ADMIN04',
                'target_exam' => 'TNPSC Group 4 & VAO 2024',
                'medium' => 'ta',
                'is_admin' => true,
            ]
        );
        Streak::firstOrCreate(['user_id' => $admin2->id], ['current' => 14, 'best' => 21]);

        // 3. Aspirant Student User
        $aspirant = User::updateOrCreate(
            ['email' => 'google-user@gmail.com'],
            [
                'name' => 'அன்பழகன்',
                'phone' => '9000000001',
                'password' => Hash::make('password123'),
                'aspirant_id' => 'TNPSC-2026-7954',
                'target_exam' => 'TNPSC Group 4 & VAO 2024',
                'medium' => 'ta',
                'is_admin' => false,
            ]
        );
        Streak::firstOrCreate(['user_id' => $aspirant->id], ['current' => 7, 'best' => 14]);
    }
}
