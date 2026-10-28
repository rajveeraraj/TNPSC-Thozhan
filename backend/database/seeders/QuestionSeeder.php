<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\User;
use App\Models\Streak;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class QuestionSeeder extends Seeder
{
    public function run(): void
    {
        // Authentic TNPSC Questions Dataset
        $questions = [
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'தமிழ் இலக்கியம்',
                'question_ta' => 'சிலப்பதிகாரத்தின் ஆசிரியர் யார்?',
                'question_en' => 'Who is the author of Silappatikaram?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'சீத்தலைச் சாத்தனார்', 'text_en' => 'Seethalai Sathanar'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'இளங்கோவடிகள்', 'text_en' => 'Ilango Adigal'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'கம்பர்', 'text_en' => 'Kambar'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'திருவள்ளுவர்', 'text_en' => 'Thiruvalluvar'],
                ],
                'answer' => 'B',
                'explanation' => 'இளங்கோவடிகள் சேர மன்னர் மரபைச் சேர்ந்தவர். இவர் ஐம்பெருங்காப்பியங்களில் ஒன்றான சிலப்பதிகாரத்தின் ஆசிரியர் ஆவார்.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2022,
                'paper' => 'Group 2',
                'topic' => 'இந்திய அரசியல்',
                'question_ta' => 'இந்திய அரசியலமைப்பின் 32-வது சட்டப்பிரிவு எதனைப் பற்றிக் குறிப்பிடுகிறது?',
                'question_en' => 'What does Article 32 of the Indian Constitution deal with?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'சமத்துவ உரிமை', 'text_en' => 'Right to Equality'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'அரசியலமைப்புக்கு உட்பட்டு தீர்வு காணும் உரிமை', 'text_en' => 'Right to Constitutional Remedies'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'சுரண்டலுக்கு எதிரான உரிமை', 'text_en' => 'Right against Exploitation'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'சுதந்திர உரிமை', 'text_en' => 'Right to Freedom'],
                ],
                'answer' => 'B',
                'explanation' => 'டாக்டர் பி.ஆர். அம்பேத்கர் பிரிவு 32-ஐ அரசியலமைப்பின் "இதயம் மற்றும் ஆன்மா" (Heart and Soul) என்று வர்ணித்தார்.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'தமிழ்நாடு வரலாறு',
                'question_ta' => 'கீழடி அகழ்வாராய்ச்சி எந்த மாவட்டத்துடன் தொடர்புடையது?',
                'question_en' => 'Keeladi archaeological excavation is associated with which district?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'மதுரை', 'text_en' => 'Madurai'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'சிவகங்கை', 'text_en' => 'Sivagangai'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'தூத்துக்குடி', 'text_en' => 'Thoothukudi'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'திருநெல்வேலி', 'text_en' => 'Tirunelveli'],
                ],
                'answer' => 'B',
                'explanation' => 'கீழடி சிவகங்கை மாவட்டம் திருப்புவனம் தாலுகாவில் வைகை ஆற்றங்கரையில் அமைந்துள்ளது. இது சங்க கால நகர நாகரிகத்தை வெளிப்படுத்துகிறது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2021,
                'paper' => 'VAO',
                'topic' => 'கணிதம்',
                'question_ta' => 'ஒரு தொகையின் 10% வீதம் 2 ஆண்டுகளுக்கு கிடைக்கும் தனிவட்டி ₹200 எனில், அசல் தொகை யாது?',
                'question_en' => 'If the simple interest on a sum at 10% per annum for 2 years is ₹200, what is the principal?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => '₹800', 'text_en' => '₹800'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => '₹1,000', 'text_en' => '₹1,000'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => '₹1,200', 'text_en' => '₹1,200'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => '₹1,500', 'text_en' => '₹1,500'],
                ],
                'answer' => 'B',
                'explanation' => 'தனிவட்டி சூத்திரம்: SI = (P * N * R) / 100. எனவே, P = (200 * 100) / (2 * 10) = ₹1,000.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'புவியியல்',
                'question_ta' => 'தமிழ்நாட்டின் மிக உயரமான சிகரம் எது?',
                'question_en' => 'Which is the highest peak in Tamil Nadu?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'தொட்டபெட்டா', 'text_en' => 'Doddabetta'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'ஆனைமுடி', 'text_en' => 'Anamudi'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'மகேந்திரகிரி', 'text_en' => 'Mahendragiri'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'சேர்வராயன் மலை', 'text_en' => 'Servarayan Hills'],
                ],
                'answer' => 'A',
                'explanation' => 'நீலகிரி மலையில் அமைந்துள்ள தொட்டபெட்டா (2,637 மீ) தமிழ்நாட்டின் மிக உயரமான சிகரமாகும். (தென்னிந்தியாவின் மிக உயரமான சிகரம் ஆனைமுடி).',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'பொது தமிழ்',
                'question_ta' => '‘திராவிட மொழிகளின் ஒப்பிலக்கணம்’ என்ற புகழ்பெற்ற நூலின் ஆசிரியர் யார்?',
                'question_en' => 'Who is the author of "A Comparative Grammar of the Dravidian Languages"?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'ஜி.யு. போப்', 'text_en' => 'G.U. Pope'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'ராபர்ட் கால்டுவெல்', 'text_en' => 'Robert Caldwell'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'வீரமாமுனிவர்', 'text_en' => 'Veeramamunivar'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'சீகன்பால்கு', 'text_en' => 'Ziegenbalg'],
                ],
                'answer' => 'B',
                'explanation' => 'ராபர்ட் கால்டுவெல் 1856-ல் இந்நூலை இயற்றினார். இந்நூல் திராவிட மொழிக் குடும்பத்தின் தனித்துவத்தை உலகிற்கு உணர்த்தியது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2022,
                'paper' => 'Group 2',
                'topic' => 'இந்திய அரசியல்',
                'question_ta' => 'அடிப்படை உரிமைகள் இந்திய அரசியலமைப்பின் எந்த பகுதியில் சேர்க்கப்பட்டுள்ளன?',
                'question_en' => 'Fundamental Rights are incorporated in which Part of the Indian Constitution?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'பகுதி II', 'text_en' => 'Part II'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'பகுதி III', 'text_en' => 'Part III'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'பகுதி IV', 'text_en' => 'Part IV'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'பகுதி IV-A', 'text_en' => 'Part IV-A'],
                ],
                'answer' => 'B',
                'explanation' => 'அரசியலமைப்பு பகுதி III (சட்டப்பிரிவுகள் 12 முதல் 35 வரை) அடிப்படை உரிமைகளைப் பற்றி விவரிக்கிறது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'தமிழ் இலக்கியம்',
                'question_ta' => 'திருக்குறளில் உள்ள மொத்த அதிகாரங்களின் எண்ணிக்கை எத்தனை?',
                'question_en' => 'What is the total number of chapters (Adhikarams) in Thirukkural?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => '130', 'text_en' => '130'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => '133', 'text_en' => '133'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => '150', 'text_en' => '150'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => '120', 'text_en' => '120'],
                ],
                'answer' => 'B',
                'explanation' => 'திருக்குறள் 3 பால்கள், 133 அதிகாரங்கள் மற்றும் 1330 குறட்பாக்களைக் கொண்டது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'பொது அறிவு',
                'question_ta' => 'இந்தியாவின் தேசிய நதி எது?',
                'question_en' => 'Which is the National River of India?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'கங்கை', 'text_en' => 'Ganga'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'பிரம்மபுத்திரா', 'text_en' => 'Brahmaputra'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'யமுனை', 'text_en' => 'Yamuna'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'காவிரி', 'text_en' => 'Cauvery'],
                ],
                'answer' => 'A',
                'explanation' => 'கங்கை நதி 2008-ஆம் ஆண்டு இந்தியாவின் தேசிய நதியாக அறிவிக்கப்பட்டது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2022,
                'paper' => 'Group 2',
                'topic' => 'தமிழ்நாடு வரலாறு',
                'question_ta' => 'தென்னிந்தியாவின் மான்செஸ்டர் என்று அழைக்கப்படும் நகரம் எது?',
                'question_en' => 'Which city is known as the "Manchester of South India"?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'சென்னை', 'text_en' => 'Chennai'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'கோயம்புத்தூர்', 'text_en' => 'Coimbatore'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'மதுரை', 'text_en' => 'Madurai'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'ஈரோடு', 'text_en' => 'Erode'],
                ],
                'answer' => 'B',
                'explanation' => 'பருத்தி ஜவுளித் தொழிலில் முன்னணியில் இருப்பதால் கோயம்புத்தூர் "தென்னிந்தியாவின் மான்செஸ்டர்" எனப்படுகிறது.',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2021,
                'paper' => 'VAO',
                'topic' => 'கணிதம்',
                'question_ta' => '2, 3, 5, 7, 11, ? - அடுத்த பகா எண் (Prime Number) எது?',
                'question_en' => '2, 3, 5, 7, 11, ? - What is the next prime number?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => '12', 'text_en' => '12'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => '13', 'text_en' => '13'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => '14', 'text_en' => '14'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => '15', 'text_en' => '15'],
                ],
                'answer' => 'B',
                'explanation' => '11-க்கு அடுத்த பகா எண் 13 ஆகும் (1 மற்றும் அதே எண்ணால் மட்டுமே வகுபடும் எண்).',
                'review_status' => 'verified',
            ],
            [
                'exam' => 'TNPSC',
                'year' => 2023,
                'paper' => 'Group 4',
                'topic' => 'பொது தமிழ்',
                'question_ta' => '‘வீரமாமுனிவர்’ தமிழ் மொழியில் இயற்றிய புகழ்பெற்ற காப்பியம் எது?',
                'question_en' => 'Which famous epic in Tamil was composed by Veeramamunivar?',
                'options' => [
                    ['id' => 'A', 'label' => 'அ', 'text_ta' => 'இரட்சணிய யாத்திரிகம்', 'text_en' => 'Ratchanya Yathrigam'],
                    ['id' => 'B', 'label' => 'ஆ', 'text_ta' => 'தேம்பாவணி', 'text_en' => 'Thembavani'],
                    ['id' => 'C', 'label' => 'இ', 'text_ta' => 'சீறாப்புராணம்', 'text_en' => 'Seerapuranam'],
                    ['id' => 'D', 'label' => 'ஈ', 'text_ta' => 'இயேசு காவியம்', 'text_en' => 'Yesu Kaviyam'],
                ],
                'answer' => 'B',
                'explanation' => 'தேம்பாவணி (வாடாத மாலை) வீரமாமுனிவரால் (கான்ஸ்டன்டைன் ஜோசப் பெஸ்கி) இயற்றப்பட்டது.',
                'review_status' => 'verified',
            ],
        ];

        foreach ($questions as $q) {
            Question::updateOrCreate(
                ['question_ta' => $q['question_ta']],
                $q
            );
        }
    }
}
