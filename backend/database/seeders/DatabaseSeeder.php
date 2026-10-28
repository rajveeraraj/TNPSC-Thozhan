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
        // Only seed authentic questions bank; ZERO sample users!
        $this->call(QuestionSeeder::class);
    }
}
