<?php

namespace Tests\Feature;

use App\Models\Question;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'மதிப்பாய்வாளர் (Admin)',
            'phone' => '9842173650',
            'email' => 'admin@tnpsc.local',
            'password' => 'password123',
            'is_admin' => true,
            'aspirant_id' => 'ADMIN04',
        ]);
    }

    public function test_admin_login_page_is_accessible(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
        $response->assertSee('உள்நுழைவு');
        $response->assertSee('TNPSC தோழன்');
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_login_with_phone_and_password(): void
    {
        $response = $this->post('/admin/login', [
            'login' => '9842173650',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($this->admin);
    }

    public function test_admin_can_login_with_email_and_password(): void
    {
        $response = $this->post('/admin/login', [
            'login' => 'admin@tnpsc.local',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($this->admin);
    }

    public function test_admin_dashboard_shows_live_database_metrics(): void
    {
        Question::create([
            'exam' => 'TNPSC',
            'year' => 2024,
            'paper' => 'Group 4 & VAO',
            'topic' => 'பொதுத்தமிழ் & தமிழ் இலக்கியம்',
            'question_ta' => 'திருக்குறள் எத்தனை அதிகாரங்களை உடையது?',
            'options' => [
                ['id' => 'A', 'label' => 'அ', 'text_ta' => '133', 'text_en' => '133'],
                ['id' => 'B', 'label' => 'ஆ', 'text_ta' => '120', 'text_en' => '120'],
                ['id' => 'C', 'label' => 'இ', 'text_ta' => '150', 'text_en' => '150'],
                ['id' => 'D', 'label' => 'ஈ', 'text_ta' => '100', 'text_en' => '100'],
            ],
            'answer' => 'A',
            'explanation' => 'திருக்குறள் 133 அதிகாரங்களைக் கொண்டது.',
            'review_status' => 'verified',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/dashboard');
        $response->assertStatus(200);
        $response->assertSee('வினா வங்கி மேலோட்டம்');
        $response->assertSee('பொதுத்தமிழ் &amp; தமிழ் இலக்கியம்', false);
    }

    public function test_admin_can_view_questions_list(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/questions');
        $response->assertStatus(200);
        $response->assertSee('வினாக்கள் மேலாண்மை');
    }

    public function test_admin_can_create_new_question(): void
    {
        $payload = [
            'exam' => 'TNPSC',
            'year' => 2024,
            'paper' => 'Group 4 & VAO',
            'topic' => 'இந்திய ஆட்சியியல் & அரசியலமைப்பு',
            'question_ta' => 'இந்திய அரசியலமைப்பின் 32-வது உறுப்பு யாது?',
            'question_en' => 'What is Article 32 of Indian Constitution?',
            'option_A_ta' => 'நீதிப்பேராணை தீர்வுகள்',
            'option_A_en' => 'Constitutional Remedies',
            'option_B_ta' => 'சுதந்திர உரிமை',
            'option_B_en' => 'Right to Freedom',
            'option_C_ta' => 'சமத்துவ உரிமை',
            'option_C_en' => 'Right to Equality',
            'option_D_ta' => 'கல்வி உரிமை',
            'option_D_en' => 'Right to Education',
            'answer' => 'A',
            'explanation' => 'உறுப்பு 32 அரசியலமைப்பு தீர்வுகளுக்கான உரிமையை வழங்குகிறது.',
            'source_pdf' => '10-ஆம் வகுப்பு சமச்சீர்',
            'review_status' => 'verified',
        ];

        $response = $this->actingAs($this->admin)->post('/admin/questions', $payload);
        $response->assertRedirect('/admin/questions');

        $this->assertDatabaseHas('questions', [
            'question_ta' => 'இந்திய அரசியலமைப்பின் 32-வது உறுப்பு யாது?',
            'answer' => 'A',
        ]);
    }

    public function test_admin_can_bulk_import_questions_via_json(): void
    {
        $jsonData = json_encode([
            [
                'question' => 'தமிழ்நாட்டின் மாநில மரம் எது?',
                'options' => ['பனை மரம்', 'ஆல மரம்', 'வேப்ப மரம்', 'மா மரம்'],
                'answer' => 0,
                'unit' => 'தமிழ்நாடு வரலாறு',
                'paper' => 'Group 4 & VAO',
                'explanation' => 'தமிழ்நாட்டின் மாநில மரம் பனை மரம் ஆகும்.',
            ]
        ]);

        $response = $this->actingAs($this->admin)->post('/admin/bulk/import', [
            'format' => 'json',
            'raw_input' => $jsonData,
            'default_status' => 'verified',
            'skip_duplicates' => 1,
        ]);

        $response->assertRedirect('/admin/questions');
        $this->assertDatabaseHas('questions', [
            'question_ta' => 'தமிழ்நாட்டின் மாநில மரம் எது?',
            'answer' => 'A',
        ]);
    }

    public function test_admin_can_export_questions(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/bulk/export?format=json');
        $response->assertStatus(200);
        $this->assertEquals('application/json; charset=UTF-8', $response->headers->get('Content-Type'));
    }

    public function test_admin_can_logout(): void
    {
        $response = $this->actingAs($this->admin)->post('/admin/logout');
        $response->assertRedirect('/admin/login');
        $this->assertGuest();
    }
}
