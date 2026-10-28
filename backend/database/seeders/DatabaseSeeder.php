<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed authentic questions bank and default users
        $this->call(QuestionSeeder::class);
        $this->call(UserSeeder::class);
    }
}
