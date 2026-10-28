<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * GET /api/questions
     */
    public function index(Request $request): JsonResponse
    {
        $query = Question::query();

        if ($request->filled('exam')) {
            $query->where('exam', $request->query('exam'));
        }

        if ($request->filled('year')) {
            $query->where('year', (int) $request->query('year'));
        }

        if ($request->filled('paper')) {
            $query->where('paper', 'like', '%' . $request->query('paper') . '%');
        }

        if ($request->filled('topic')) {
            $query->where('topic', 'like', '%' . $request->query('topic') . '%');
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('question_ta', 'like', "%{$search}%")
                  ->orWhere('question_en', 'like', "%{$search}%")
                  ->orWhere('topic', 'like', "%{$search}%");
            });
        }

        $limit = min((int) $request->query('limit', 15), 50);
        $questions = $query->paginate($limit);

        return response()->json([
            'data' => $questions->items(),
            'meta' => [
                'current_page' => $questions->currentPage(),
                'last_page' => $questions->lastPage(),
                'per_page' => $questions->perPage(),
                'total' => $questions->total(),
            ],
            'message' => 'வினாக்கள் பெறப்பட்டன',
        ]);
    }

    /**
     * GET /api/topics
     */
    public function topics(Request $request): JsonResponse
    {
        $user = $request->user('sanctum') ?? $request->user();

        $topicDefinitions = [
            [
                'id' => 'topic_tamil_grammar',
                'title' => 'பொது தமிழ் - இலக்கணம்',
                'name_ta' => 'பொது தமிழ் - இலக்கணம்',
                'name_en' => 'Tamil Grammar',
                'subtitle' => 'எழுத்து, சொல், பொருள், யாப்பு, அணி',
                'total_questions' => 450,
                'question_count' => 450,
                'category' => 'tamil',
                'db_topic' => 'தமிழ் இலக்கணம்',
                'icon' => 'spellcheck',
                'tag' => 'Group 4 சிறப்புப் பகுதி',
                'color' => 'secondary',
            ],
            [
                'id' => 'topic_tamil_literature',
                'title' => 'தமிழ் இலக்கியம்',
                'name_ta' => 'தமிழ் இலக்கியம்',
                'name_en' => 'Tamil Literature',
                'subtitle' => 'சங்க இலக்கியம், திருக்குறள், காப்பியங்கள்',
                'total_questions' => 520,
                'question_count' => 520,
                'category' => 'tamil',
                'db_topic' => 'தமிழ் இலக்கியம்',
                'icon' => 'menu_book',
                'tag' => 'அனைத்து TNPSC தேர்வுகள்',
                'color' => 'secondary',
            ],
            [
                'id' => 'topic_polity',
                'title' => 'இந்திய அரசியல் (Indian Polity)',
                'name_ta' => 'இந்திய அரசியல் (Indian Polity)',
                'name_en' => 'Indian Polity',
                'subtitle' => 'அரசியலமைப்பு சட்டம், அடிப்படை உரிமைகள், நாடாளுமன்றம்',
                'total_questions' => 380,
                'question_count' => 380,
                'category' => 'polity',
                'db_topic' => 'இந்திய அரசியல்',
                'icon' => 'account_balance',
                'tag' => 'Unit 5 சிறப்புப் பகுதி',
                'color' => 'primary',
            ],
            [
                'id' => 'topic_history',
                'title' => 'வரலாறு & தமிழ்நாடு பண்பாடு',
                'name_ta' => 'வரலாறு & தமிழ்நாடு பண்பாடு',
                'name_en' => 'Tamil Nadu History & Culture',
                'subtitle' => 'சிந்து சமவெளி, சங்க காலம், விடுதலைப் போராட்டம்',
                'total_questions' => 410,
                'question_count' => 410,
                'category' => 'history',
                'db_topic' => 'வரலாறு',
                'icon' => 'history_edu',
                'tag' => 'Unit 8 & Unit 9',
                'color' => 'tertiary',
            ],
            [
                'id' => 'topic_maths',
                'title' => 'கணிதம் & திறனறிதல் (Maths & Aptitude)',
                'name_ta' => 'கணிதம் & திறனறிதல் (Maths & Aptitude)',
                'name_en' => 'Maths & Aptitude',
                'subtitle' => 'தனிவட்டி, கூட்டுவட்டி, பரப்பளவு, மீ.பொ.வ',
                'total_questions' => 350,
                'question_count' => 350,
                'category' => 'maths',
                'db_topic' => 'கணிதம்',
                'icon' => 'calculate',
                'tag' => '25 மதிப்பெண்கள் உறுதி',
                'color' => 'secondary',
            ],
            [
                'id' => 'topic_gk_science',
                'title' => 'பொது அறிவியல் & நடப்பு நிகழ்வுகள்',
                'name_ta' => 'பொது அறிவியல் & நடப்பு நிகழ்வுகள்',
                'name_en' => 'General Science & Current Affairs',
                'subtitle' => 'இயற்பியல், உயிரியல், நடப்பு நிகழ்வுகள் 2024',
                'total_questions' => 400,
                'question_count' => 400,
                'category' => 'gk',
                'db_topic' => 'பொது அறிவு',
                'icon' => 'science',
                'tag' => 'பொது அறிவு பகுதி',
                'color' => 'primary',
            ],
        ];

        $topics = [];
        foreach ($topicDefinitions as $def) {
            $completedCount = 0;
            if ($user) {
                $completedCount = $user->attempts()
                    ->whereHas('question', function ($q) use ($def) {
                        $q->where('topic', 'like', '%' . $def['db_topic'] . '%');
                    })
                    ->count();
            }

            $percentage = $def['total_questions'] > 0
                ? min(100, (int) round(($completedCount / $def['total_questions']) * 100))
                : 0;

            $topics[] = array_merge($def, [
                'completed_count' => $completedCount,
                'progress_percentage' => $percentage,
                'completed_percentage' => $percentage,
                'is_bookmarked' => false,
            ]);
        }

        return response()->json([
            'data' => $topics,
            'message' => 'பாடப்பிரிவுகள் பெறப்பட்டன',
        ]);
    }

    /**
     * GET /api/pyqs
     */
    public function pyqs(): JsonResponse
    {
        $pyqs = [
            [
                'id' => 'pyq_2023_g4',
                'exam' => 'TNPSC Group 4',
                'year' => 2023,
                'paper_title_ta' => 'TNPSC Group 4 - 2023 வினாத்தாள்',
                'paper_title_en' => 'TNPSC Group 4 2023 Official Paper',
                'total_questions' => 200,
                'time_limit_minutes' => 180,
                'badge_ta' => 'நேரலை மாதிரித் தேர்வு',
                'category' => 'group4',
            ],
            [
                'id' => 'pyq_2022_g2',
                'exam' => 'TNPSC Group 2',
                'year' => 2022,
                'paper_title_ta' => 'TNPSC Group 2 - 2022 வினாத்தாள்',
                'paper_title_en' => 'TNPSC Group 2/2A 2022 Official Paper',
                'total_questions' => 175,
                'time_limit_minutes' => 180,
                'badge_ta' => 'விளக்கமான விடை',
                'category' => 'group2',
            ],
            [
                'id' => 'pyq_2021_vao',
                'exam' => 'TNPSC VAO',
                'year' => 2021,
                'paper_title_ta' => 'VAO Exam - 2021 வினாத்தாள்',
                'paper_title_en' => 'Village Administrative Officer 2021',
                'total_questions' => 150,
                'time_limit_minutes' => 150,
                'badge_ta' => 'முந்தைய ஆண்டு தாள்',
                'category' => 'vao',
            ],
        ];

        return response()->json([
            'data' => $pyqs,
            'message' => 'முந்தைய ஆண்டு வினாத்தாள்கள் பெறப்பட்டன',
        ]);
    }
}
