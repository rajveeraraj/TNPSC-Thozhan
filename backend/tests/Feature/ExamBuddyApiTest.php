<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\QuestionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExamBuddyApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed questions database
        $this->seed(QuestionSeeder::class);

        // Create test user for test assertions
        User::create([
            'name' => 'அன்பழகன்',
            'phone' => '9842173650',
            'email' => 'anbazhagan@tnpsc.local',
            'password' => \Illuminate\Support\Facades\Hash::make('123456'),
            'aspirant_id' => 'TNPSC-2024-8932',
            'target_exam' => 'TNPSC Group 4 & VAO 2024',
            'medium' => 'ta',
        ]);
    }

    public function test_health_check_endpoint(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'app' => 'ExamBuddy TNPSC REST API',
            ]);
    }

    public function test_auth_login_with_phone_and_password(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'phone' => '9842173650',
            'password' => '123456',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'phone', 'aspirant_id'],
                    'token',
                ],
                'message',
            ]);
    }

    public function test_auth_register_creates_new_aspirant(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'கவியரசன்',
            'phone' => '9876543210',
            'password' => 'password123',
            'target_exam' => 'TNPSC Group 2 & 2A',
            'medium' => 'ta',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'phone', 'target_exam'],
                    'token',
                ],
            ]);
    }

    public function test_authenticated_user_profile(): void
    {
        $user = User::where('phone', '9842173650')->first();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJsonPath('data.phone', '9842173650');
    }

    public function test_topics_endpoint(): void
    {
        $response = $this->getJson('/api/topics');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name_ta', 'name_en', 'question_count', 'progress_percentage'],
                ],
            ]);
    }

    public function test_pyqs_endpoint(): void
    {
        $response = $this->getJson('/api/pyqs');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'exam', 'year', 'paper_title_ta', 'total_questions'],
                ],
            ]);
    }

    public function test_daily_quiz_endpoint(): void
    {
        $response = $this->getJson('/api/quiz/daily');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'date',
                    'total_questions',
                    'questions' => [
                        '*' => ['id', 'question_ta', 'options', 'topic'],
                    ],
                ],
            ]);
    }

    public function test_daily_quiz_submit_and_streak_update(): void
    {
        $user = User::where('phone', '9842173650')->first();
        $token = $user->createToken('quiz-token')->plainTextToken;

        $daily = $this->getJson('/api/quiz/daily')->json('data');
        $firstQuestion = $daily['questions'][0];

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/quiz/daily/submit', [
                'answers' => [
                    [
                        'question_id' => $firstQuestion['id'],
                        'selected_option' => 'B',
                    ],
                ],
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['score', 'total', 'streak'],
            ]);
    }

    public function test_user_progress_endpoint(): void
    {
        $user = User::where('phone', '9842173650')->first();
        $token = $user->createToken('progress-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/progress');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'streak' => ['current', 'best'],
                    'stats' => ['questions_solved', 'accuracy_percentage'],
                    'heatmap',
                ],
            ]);
    }

    public function test_leaderboard_endpoint(): void
    {
        $response = $this->getJson('/api/leaderboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'type',
                    'date',
                    'rankings' => [
                        '*' => ['rank', 'name', 'score', 'streak'],
                    ],
                ],
            ]);
    }
}
