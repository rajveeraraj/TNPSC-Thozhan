import type {
  Question,
  User,
  ProgressStats,
  TopicItem,
  PyqItem,
  HeatmapDay,
  StreakInfo,
} from '@/types/api';

/**
 * 36 Authentic TNPSC Questions across 6 core syllabus areas:
 * 1. தமிழ் இலக்கணம் (Tamil Grammar) - Q101 to Q106
 * 2. தமிழ் இலக்கியம் (Tamil Literature) - Q107 to Q112
 * 3. இந்திய அரசியல் (Indian Polity) - Q113 to Q118
 * 4. வரலாறு & தமிழ்நாடு மரபு (History & Tamil Culture) - Q119 to Q124
 * 5. கணிதம் & நுண்ணறிவு (Maths & Aptitude) - Q125 to Q130
 * 6. பொது அறிவு & அறிவியல் (GK & General Science) - Q131 to Q136
 */
export const mockQuestions: Question[] = [
  // 1. தமிழ் இலக்கணம் (Tamil Grammar)
  {
    id: 101,
    category: 'பொது தமிழ் • புணர்ச்சி இலக்கணம்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "கீழ்க்கண்டவற்றுள் 'செங்கோல்' என்ற சொல்லின் சரியான பிரித்தெழுதுக வடிவம் எது?",
    question_en: "Which of the following is the correct split form of the word 'Sengol'?",
    options: [
      { id: 'A', label: 'அ', text_ta: 'செம்மை + கோல்', text_en: 'Semmai + Kol' },
      { id: 'B', label: 'ஆ', text_ta: 'செங் + கோல்', text_en: 'Seng + Kol' },
      { id: 'C', label: 'இ', text_ta: 'செம் + கோல்', text_en: 'Sem + Kol' },
      { id: 'D', label: 'ஈ', text_ta: 'செம்பொன் + கோல்', text_en: 'Sempon + Kol' },
    ],
    answer: 'A',
    explanation:
      "ஈறுபோதல் விதிப்படி 'மை' விகுதி கெட்டு 'செம் + கோல்' என்றாகி, 'முன்னின்ற மெய்திரிதல்' விதிப்படி மகர மெய் ஙகர மெய்யாகத் திரிந்து 'செங்கோல்' எனப் புணர்ந்தது.",
  },
  {
    id: 102,
    category: 'பொது தமிழ் • பெயர்ச்சொல்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "'வளையல்' என்பது எவ்வகைப் பெயர்ச்சொல்?",
    question_en: "What type of noun is 'Valaiyal'?",
    options: [
      { id: 'A', label: 'அ', text_ta: 'இடுகுறிப் பொதுப்பெயர்', text_en: 'General arbitrary noun' },
      { id: 'B', label: 'ஆ', text_ta: 'இடுகுறிச் சிறப்புப்பெயர்', text_en: 'Specific arbitrary noun' },
      { id: 'C', label: 'இ', text_ta: 'காரணப் பொதுப்பெயர்', text_en: 'General causal noun' },
      { id: 'D', label: 'ஈ', text_ta: 'காரணச் சிறப்புப்பெயர்', text_en: 'Specific causal noun' },
    ],
    answer: 'D',
    explanation:
      "வளைந்த வடிவம் உடைய காரணத்தால் 'காரணப் பெயர்' எனவும், அவ்வடிவமுடைய குறிப்பிட்ட கை அணிகலனைக் குறிப்பதால் 'காரணச் சிறப்புப்பெயர்' எனவும் அழைக்கப்படுகிறது.",
  },
  {
    id: 103,
    category: 'பொது தமிழ் • அணியிலக்கணம்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 2',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "'அன்பும் அறனும் உடைத்தாயின் இல்வாழ்க்கை பண்பும் பயனும் அது' - இக்குறட்பாவில் பயின்று வந்துள்ள அணி எது?",
    question_en: 'Which poetic figure of speech (Ani) is used in this Thirukkural couplet?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நிரல் நிறை அணி', text_en: 'Niral Nirai Ani' },
      { id: 'B', label: 'ஆ', text_ta: 'உவமை அணி', text_en: 'Uvamai Ani' },
      { id: 'C', label: 'இ', text_ta: 'வேற்றுமை அணி', text_en: 'Vetrumai Ani' },
      { id: 'D', label: 'ஈ', text_ta: 'சொற்பொருள் பின்வருநிலையணி', text_en: 'Sorporul Pinvarunilai Ani' },
    ],
    answer: 'A',
    explanation:
      "அன்பும் அறனும் என்ற சொற்களை வரிசையாக நிறுத்தி, பண்பும் பயனும் என்று அவற்றுக்குரிய பயன்களை முறைப்படக் கூறியதால் இது நிரல் நிறை அணி எனப்படும்.",
  },
  {
    id: 104,
    category: 'பொது தமிழ் • வேற்றுமை இலக்கணம்',
    exam: 'TNPSC',
    year: 2021,
    paper: 'VAO',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "'பொருந்தா இணையைக் கண்டறிக' (வேற்றுமை உருபுகள்):",
    question_en: 'Find the mismatched pair (Case endings):',
    options: [
      { id: 'A', label: 'அ', text_ta: 'இரண்டாம் வேற்றுமை - ஐ', text_en: 'Second case - Ai' },
      { id: 'B', label: 'ஆ', text_ta: 'மூன்றாம் வேற்றுமை - ஆல்', text_en: 'Third case - Aal' },
      { id: 'C', label: 'இ', text_ta: 'நான்காம் வேற்றுமை - இன்', text_en: 'Fourth case - In' },
      { id: 'D', label: 'ஈ', text_ta: 'ஐந்தாம் வேற்றுமை - இல், இன்', text_en: 'Fifth case - Il, In' },
    ],
    answer: 'C',
    explanation:
      "நான்காம் வேற்றுமையின் உருபு 'கு' ஆகும். 'இன்' என்பது ஐந்தாம் வேற்றுமைக்குரிய உருபாகும். எனவே 'நான்காம் வேற்றுமை - இன்' என்பது பொருந்தாத இணையான தவறான விடையாகும்.",
  },
  {
    id: 105,
    category: 'பொது தமிழ் • மேற்கோள்கள்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "'கற்கை நன்றே கற்கை நன்றே பிச்சை புகினும் கற்கை நன்றே' - இவ்வடிகள் இடம்பெற்ற நூல் எது?",
    question_en: 'In which literary work do these lines appear?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நறுந்தொகை (வெற்றிவேற்கை)', text_en: 'Narunthogai (Vetrivelkai)' },
      { id: 'B', label: 'ஆ', text_ta: 'மூதுரை', text_en: 'Moodhurai' },
      { id: 'C', label: 'இ', text_ta: 'நல்வழி', text_en: 'Nalvazhi' },
      { id: 'D', label: 'ஈ', text_ta: 'நீதிநெறி விளக்கம்', text_en: 'Needhineri Vilakkam' },
    ],
    answer: 'A',
    explanation:
      "அதிவீரராம பாண்டியர் இயற்றிய 'வெற்றிவேற்கை' (நறுந்தொகை) என்னும் நீதி நூலில் 'கற்கை நன்றே கற்கை நன்றே பிச்சை புகினும் கற்கை நன்றே' என்ற புகழ்மிக்க பாடல் வரி இடம்பெற்றுள்ளது.",
  },
  {
    id: 106,
    category: 'பொது தமிழ் • தொகைநிலைத் தொடர்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கணம்',
    question_ta: "'செவ்வானம்' - இலக்கணக் குறிப்பு தருக:",
    question_en: "Provide the grammatical definition for 'Sevvaanam':",
    options: [
      { id: 'A', label: 'அ', text_ta: 'பண்புத்தொகை', text_en: 'Panbuthogai' },
      { id: 'B', label: 'ஆ', text_ta: 'வினைத்தொகை', text_en: 'Vinaithogai' },
      { id: 'C', label: 'இ', text_ta: 'உவமைத்தொகை', text_en: 'Uvamaitogai' },
      { id: 'D', label: 'ஈ', text_ta: 'உம்மைத்தொகை', text_en: 'Ummaithogai' },
    ],
    answer: 'A',
    explanation:
      "செம்மை + வானம் = செவ்வானம். செம்மை எனும் நிறப் பண்பும், 'ஆகிய' எனும் பண்பு உருபும் மறைந்து வந்துள்ளதால் இது பண்புத்தொகை எனப்படும்.",
  },

  // 2. தமிழ் இலக்கியம் (Tamil Literature)
  {
    id: 107,
    category: 'பொது தமிழ் • ஐம்பெருங்காப்பியங்கள்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: 'சிலப்பதிகாரத்தின் ஆசிரியர் யார்?',
    question_en: 'Who is the author of Silappatikaram?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'சீத்தலைச் சாத்தனார்', text_en: 'Seethalai Sathanar' },
      { id: 'B', label: 'ஆ', text_ta: 'இளங்கோவடிகள்', text_en: 'Ilango Adigal' },
      { id: 'C', label: 'இ', text_ta: 'கம்பர்', text_en: 'Kambar' },
      { id: 'D', label: 'ஈ', text_ta: 'திருவள்ளுவர்', text_en: 'Thiruvalluvar' },
    ],
    answer: 'B',
    explanation:
      'இளங்கோவடிகள் சேர மன்னர் மரபைச் சேர்ந்தவர். இவர் சிலப்பதிகாரத்தின் ஆசிரியர் ஆவார். ஐம்பெருங்காப்பியங்களில் முதலாவதான சிலப்பதிகாரம் முத்தமிழ்க் காப்பியம் என்றும் போற்றப்படுகிறது.',
  },
  {
    id: 108,
    category: 'பொது தமிழ் • சங்க இலக்கியம்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 2',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: 'எட்டுத்தொகை நூல்களுள் முதலாவதாக வைத்து எண்ணப்படும் நூல் எது?',
    question_en: 'Which work is counted first among the Ettuthogai anthologies?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நற்றிணை', text_en: 'Natrinai' },
      { id: 'B', label: 'ஆ', text_ta: 'குறுந்தொகை', text_en: 'Kurunthogai' },
      { id: 'C', label: 'இ', text_ta: 'ஐங்குறுநூறு', text_en: 'Ainkurunooru' },
      { id: 'D', label: 'ஈ', text_ta: 'அகநானூறு', text_en: 'Agananooru' },
    ],
    answer: 'A',
    explanation:
      "'நற்றிணை நல்ல குறுந்தொகை ஐங்குறுநூறு ஒத்த பதிற்றுப்பத்து ஓங்கு பரிபாடல்...' என்ற பழம்பெரும் வெண்பா பாடல் மூலம் நற்றிணை எட்டுத்தொகையில் முதலாவதாக வைத்து எண்ணப்படுகிறது.",
  },
  {
    id: 109,
    category: 'பொது தமிழ் • கிறிஸ்தவ இலக்கியம்',
    exam: 'TNPSC',
    year: 2021,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: "'தேம்பாவணி' நூலில் உள்ள படலங்களின் எண்ணிக்கை எத்தனை?",
    question_en: 'How many Padalams (sections) are there in Thembavani?',
    options: [
      { id: 'A', label: 'அ', text_ta: '30', text_en: '30' },
      { id: 'B', label: 'ஆ', text_ta: '36', text_en: '36' },
      { id: 'C', label: 'இ', text_ta: '42', text_en: '42' },
      { id: 'D', label: 'ஈ', text_ta: '48', text_en: '48' },
    ],
    answer: 'B',
    explanation:
      'வீரமாமுனிவர் இயற்றிய தேம்பாவணி காப்பியம் 3 காண்டங்களையும் 36 படலங்களையும் 3,615 விருத்தப் பாக்களையும் கொண்டு இயேசு கிறிஸ்துவின் வளர்ப்புத் தந்தையான யோசேப்பைத் தலைவனாகக் கொண்டது.',
  },
  {
    id: 110,
    category: 'பொது தமிழ் • பக்தி இலக்கியம்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: 'பெரியபுராணத்திற்கு சேக்கிழார் இட்ட மூலப்பெயர் யாது?',
    question_en: 'What was the original title given by Sekkizhar to Periyapuranam?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'திருத்தொண்டர் புராணம்', text_en: 'Thirutthondar Puranam' },
      { id: 'B', label: 'ஆ', text_ta: 'சிவபுராணம்', text_en: 'Sivapuranam' },
      { id: 'C', label: 'இ', text_ta: 'நாயன்மார் சரித்திரம்', text_en: 'Nayanmar Sarithiram' },
      { id: 'D', label: 'ஈ', text_ta: 'பக்திப் பெருநூல்', text_en: 'Bhakthi Perunool' },
    ],
    answer: 'A',
    explanation:
      "சேக்கிழார் அறுபத்து மூன்று தனி அடியார்கள் மற்றும் ஒன்பது தொகை அடியார்களின் வரலாற்றை விளக்கும் இந்நூலுக்கு 'திருத்தொண்டர் புராணம்' என்றே பெயரிட்டார். பிற்காலத்தில் இது பெரியபுராணம் என அழைக்கப்பட்டது.",
  },
  {
    id: 111,
    category: 'பொது தமிழ் • சிற்றிலக்கியம்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'VAO',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: 'தமிழ் விடு தூது நூலின் பாட்டுடைத் தலைவன் யார்?',
    question_en: 'Who is the deity addressed in Tamil Vidu Thoothu?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'மதுரை சொக்கநாதர்', text_en: 'Madurai Chokkanathar' },
      { id: 'B', label: 'ஆ', text_ta: 'திருச்செந்தூர் முருகன்', text_en: 'Tiruchendur Murugan' },
      { id: 'C', label: 'இ', text_ta: 'தில்லை நடராஜர்', text_en: 'Thillai Natarajar' },
      { id: 'D', label: 'ஈ', text_ta: 'திருப்பதி வேங்கடேசன்', text_en: 'Tirupati Venkatesan' },
    ],
    answer: 'A',
    explanation:
      'மதுரையில் வீற்றிருக்கும் சோமசுந்தரக் கடவுள் (மதுரை சொக்கநாதர்) மீது காதல் கொண்ட பெண் ஒருத்தி தன் காதலைத் தெரிவித்து வரத் தமிழையே தூதாக அனுப்புவதாகப் பாடப்பட்ட சிற்றிலக்கியம் இதுவாகும்.',
  },
  {
    id: 112,
    category: 'பொது தமிழ் • புறநானூறு',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 2',
    topic: 'தமிழ் இலக்கியம்',
    question_ta: "'உண்டி கொடுத்தோர் உயிர் கொடுத்தோரே' - புறநானூற்றில் இப்பாடலைப் பாடியவர் யார்?",
    question_en: 'Who sang the famous line in Purananooru: "Undi Koduthor Uyir Koduthore"?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'ஔவையார்', text_en: 'Avvaiyar' },
      { id: 'B', label: 'ஆ', text_ta: 'குடபுலவியனார்', text_en: 'Kudapulaviyanar' },
      { id: 'C', label: 'இ', text_ta: 'கபிலர்', text_en: 'Kapilar' },
      { id: 'D', label: 'ஈ', text_ta: 'நக்கீரர்', text_en: 'Nakkirar' },
    ],
    answer: 'B',
    explanation:
      'பாண்டியன் நெடுஞ்செழியனின் சிறப்பைப் போற்றி, நீரையும் நிலத்தையும் இணைத்து உண்டி கொடுத்தோரே உயிர் கொடுத்தோராவர் என்று குடபுலவியனார் புறநானூற்றில் பாடியுள்ளார் (புறம்: 18).',
  },

  // 3. இந்திய அரசியல் (Indian Polity)
  {
    id: 113,
    category: 'இந்திய அரசியல் • அடிப்படை உரிமைகள்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'இந்திய அரசியல்',
    question_ta: "இந்திய அரசியலமைப்பின் எந்தப் பிரிவு 'தீண்டாமை ஒழிப்பு' பற்றி கூறுகிறது?",
    question_en: 'Which article of the Indian Constitution deals with the Abolition of Untouchability?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'பிரிவு 14 (Article 14)', text_en: 'Article 14' },
      { id: 'B', label: 'ஆ', text_ta: 'பிரிவு 17 (Article 17)', text_en: 'Article 17' },
      { id: 'C', label: 'இ', text_ta: 'பிரிவு 19 (Article 19)', text_en: 'Article 19' },
      { id: 'D', label: 'ஈ', text_ta: 'பிரிவு 21 (Article 21)', text_en: 'Article 21' },
    ],
    answer: 'B',
    explanation:
      'சரத்து 17 தீண்டாமையை முற்றிலுமாக ஒழிக்கிறது மற்றும் எந்த வடிவிலும் அது கடைப்பிடிக்கப்படுவதைத் தடை செய்து தண்டனைக்குரிய குற்றமாக்குகிறது.',
  },
  {
    id: 114,
    category: 'இந்திய அரசியல் • அரசியலமைப்பு தீர்வுகள்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 2',
    topic: 'இந்திய அரசியல்',
    question_ta:
      "இந்திய அரசியலமைப்பின் 'இதயம் மற்றும் ஆன்மா' என டாக்டர் பி.ஆர். அம்பேத்கர் வர்ணித்த சட்டப்பிரிவு எது?",
    question_en:
      "Which Article was described as the 'Heart and Soul' of the Constitution by Dr. B.R. Ambedkar?",
    options: [
      { id: 'A', label: 'அ', text_ta: 'சரத்து 19 (Article 19)', text_en: 'Article 19' },
      { id: 'B', label: 'ஆ', text_ta: 'சரத்து 21 (Article 21)', text_en: 'Article 21' },
      { id: 'C', label: 'இ', text_ta: 'சரத்து 32 (Article 32)', text_en: 'Article 32' },
      { id: 'D', label: 'ஈ', text_ta: 'சரத்து 226 (Article 226)', text_en: 'Article 226' },
    ],
    answer: 'C',
    explanation:
      "அரசியலமைப்புக்கு உட்பட்டு அடிப்படை உரிமைகளை நிலைநாட்ட உச்சநீதிமன்றத்தில் தீர்வு காணும் உரிமையை வழங்கும் சரத்து 32-ஐ டாக்டர் அம்பேத்கர் 'அரசியலமைப்பின் இதயம் மற்றும் ஆன்மா' என்றார்.",
  },
  {
    id: 115,
    category: 'இந்திய அரசியல் • குடியரசுத் தலைவர்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'இந்திய அரசியல்',
    question_ta: 'குடியரசுத் தலைவர் தேர்தலில் வாக்களிக்கும் வாக்காளர் குழுவில் இடம்பெறுபவர்கள் யார்?',
    question_en: 'Who constitutes the Electoral College for the election of the President of India?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நாடாளுமன்ற இரு அவைகளின் நியமன உறுப்பினர்கள் மட்டுமே', text_en: 'Nominated MPs only' },
      { id: 'B', label: 'ஆ', text_ta: 'நாடாளுமன்றம் மற்றும் மாநில சட்டமன்றங்களின் தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்', text_en: 'Elected MPs and elected MLAs' },
      { id: 'C', label: 'இ', text_ta: 'அனைத்து மாநில சட்ட மேலவை உறுப்பினர்கள்', text_en: 'All MLCs' },
      { id: 'D', label: 'ஈ', text_ta: 'பொதுமக்கள் நேரடியாக வாக்களிக்கின்றனர்', text_en: 'Direct public vote' },
    ],
    answer: 'B',
    explanation:
      'சரத்து 54-ன் படி நாடாளுமன்றத்தின் இரு அவைகளின் தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள் மற்றும் அனைத்து மாநிலங்கள் மற்றும் தில்லி, புதுச்சேரி சட்டமன்றங்களின் தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள் வாக்களிக்கின்றனர்.',
  },
  {
    id: 116,
    category: 'இந்திய அரசியல் • உள்ளாட்சி அமைப்புகள்',
    exam: 'TNPSC',
    year: 2021,
    paper: 'VAO',
    topic: 'இந்திய அரசியல்',
    question_ta: 'பஞ்சாயத்து ராஜ் அமைப்பிற்கு அரசியலமைப்பு அந்தஸ்து வழங்கிய சட்டத்திருத்தம் எது?',
    question_en: 'Which constitutional amendment granted constitutional status to Panchayati Raj?',
    options: [
      { id: 'A', label: 'அ', text_ta: '42-வது சட்டத்திருத்தம் 1976', text_en: '42nd Amendment 1976' },
      { id: 'B', label: 'ஆ', text_ta: '44-வது சட்டத்திருத்தம் 1978', text_en: '44th Amendment 1978' },
      { id: 'C', label: 'இ', text_ta: '73-வது சட்டத்திருத்தம் 1992', text_en: '73rd Amendment 1992' },
      { id: 'D', label: 'ஈ', text_ta: '86-வது சட்டத்திருத்தம் 2002', text_en: '86th Amendment 2002' },
    ],
    answer: 'C',
    explanation:
      '1992-ஆம் ஆண்டின் 73-வது அரசியலமைப்புத் திருத்தச் சட்டம் பகுதி IX மற்றும் 11-வது அட்டவணையை இணைத்து கிராமப்புற உள்ளாட்சி அமைப்புகளுக்கு அரசியலமைப்பு அங்கீகாரத்தை வழங்கியது.',
  },
  {
    id: 117,
    category: 'இந்திய அரசியல் • நிதி உறவுகள்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 2',
    topic: 'இந்திய அரசியல்',
    question_ta: 'மத்திய அரசுக்கும் மாநில அரசுகளுக்கும் இடையிலான நிதி பகிர்வு குறித்து பரிந்துரைக்கும் அரசியலமைப்பு அமைப்பு எது?',
    question_en: 'Which constitutional body recommends financial devolution between Union and States?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நிதி ஆயோக் (NITI Aayog)', text_en: 'NITI Aayog' },
      { id: 'B', label: 'ஆ', text_ta: 'மத்திய நிதி ஆணையம் (Finance Commission - Art 280)', text_en: 'Finance Commission (Art 280)' },
      { id: 'C', label: 'இ', text_ta: 'மத்திய திட்டக் குழு (Planning Commission)', text_en: 'Planning Commission' },
      { id: 'D', label: 'ஈ', text_ta: 'ரிசர்வ் வங்கி (RBI)', text_en: 'Reserve Bank of India' },
    ],
    answer: 'B',
    explanation:
      'சரத்து 280-ன் கீழ் குடியரசுத் தலைவரால் ஐந்து ஆண்டுகளுக்கு ஒருமுறை அமைக்கப்படும் நிதி ஆணையம் மத்திய-மாநில வரிகள் மற்றும் மானியப் பகிர்வு குறித்த பரிந்துரைகளை வழங்குகிறது.',
  },
  {
    id: 118,
    category: 'இந்திய அரசியல் • முகவுரை',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'இந்திய அரசியல்',
    question_ta: 'இந்திய அரசியலமைப்பின் முகவுரை (Preamble) இதுவரை எத்தனை முறை திருத்தப்பட்டுள்ளது?',
    question_en: 'How many times has the Preamble of the Indian Constitution been amended so far?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'ஒரு முறை (1976 - 42-வது திருத்தம்)', text_en: 'Once (1976 - 42nd Amendment)' },
      { id: 'B', label: 'ஆ', text_ta: 'இரண்டு முறை', text_en: 'Twice' },
      { id: 'C', label: 'இ', text_ta: 'மூன்று முறை', text_en: 'Three times' },
      { id: 'D', label: 'ஈ', text_ta: 'இதுவரை திருத்தப்படவில்லை', text_en: 'Never amended' },
    ],
    answer: 'A',
    explanation:
      "1976-ஆம் ஆண்டின் 42-வது அரசியலமைப்புத் திருத்தச் சட்டத்தின் மூலம் முகவுரை ஒரே ஒருமுறை மட்டுமே திருத்தப்பட்டு 'சமதர்ம, மதச்சார்பற்ற, ஒருமைப்பாடு' ஆகிய சொற்கள் சேர்க்கப்பட்டன.",
  },

  // 4. வரலாறு & தமிழ்நாடு மரபு (History & Tamil Culture - Unit 8)
  {
    id: 119,
    category: 'வரலாறு • தொல்லியல் அகழாய்வு',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'வரலாறு',
    question_ta: 'கீழடி தொல்லியல் அகழாய்வு தளம் எந்த ஆற்றுப்படுகையில் அமைந்துள்ளது?',
    question_en: 'Along the basin of which river is the Keezhadi excavation site situated?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'காவிரி ஆறு', text_en: 'Cauvery River' },
      { id: 'B', label: 'ஆ', text_ta: 'வைகை ஆறு', text_en: 'Vaigai River' },
      { id: 'C', label: 'இ', text_ta: 'தாமிரபரணி ஆறு', text_en: 'Thamirabarani River' },
      { id: 'D', label: 'ஈ', text_ta: 'பாலாறு', text_en: 'Palar River' },
    ],
    answer: 'B',
    explanation:
      'சிவகங்கை மாவட்டம் திருப்புவனம் வட்டத்தில் உள்ள கீழடி, பழங்கால வைகை நதிக்கரை நாகரிகத்தின் நகரமயமாக்கலையும் சங்க காலத் தமிழர்களின் எழுத்தறிவையும் வெளிப்படுத்தும் தொல்லியல் களமாகும்.',
  },
  {
    id: 120,
    category: 'வரலாறு • இந்திய விடுதலைப் போராட்டம்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'வரலாறு',
    question_ta: 'ஆங்கிலேய கிழக்கிந்திய கம்பெனிக்கு எதிரான வரலாற்றுச் சிறப்புமிக்க வேலூர் புரட்சி வெடித்த ஆண்டு எது?',
    question_en: 'In which year did the historic Vellore Mutiny break out against British rule?',
    options: [
      { id: 'A', label: 'அ', text_ta: '1801', text_en: '1801' },
      { id: 'B', label: 'ஆ', text_ta: '1806', text_en: '1806' },
      { id: 'C', label: 'இ', text_ta: '1857', text_en: '1857' },
      { id: 'D', label: 'ஈ', text_ta: '1799', text_en: '1799' },
    ],
    answer: 'B',
    explanation:
      '1806 ஜூலை 10 அன்று புதிய இராணுவ விதிமுறைகள் மற்றும் தலைப்பாகை மாற்றங்களுக்கு எதிராக வேலூர் கோட்டையில் இந்திய சிப்பாய்கள் முதல் பெரும் புரட்சியை வெடிக்கச் செய்தனர்.',
  },
  {
    id: 121,
    category: 'வரலாறு • பாளையக்காரர் கிளர்ச்சி',
    exam: 'TNPSC',
    year: 2021,
    paper: 'VAO',
    topic: 'வரலாறு',
    question_ta: 'வீரபாண்டிய கட்டபொம்மன் எந்த இடத்தில் ஆங்கிலேய தளபதி பானர்மேனால் தூக்கிலிடப்பட்டார்?',
    question_en: 'At which place was Veerapandiya Kattabomman executed by hanging by Bannerman?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'பாஞ்சாலங்குறிச்சி', text_en: 'Panchalankurichi' },
      { id: 'B', label: 'ஆ', text_ta: 'கயத்தாறு', text_en: 'Kayathar' },
      { id: 'C', label: 'இ', text_ta: 'திருப்பத்தூர்', text_en: 'Tiruppathur' },
      { id: 'D', label: 'ஈ', text_ta: 'பாளையங்கோட்டை', text_en: 'Palayamkottai' },
    ],
    answer: 'B',
    explanation:
      '1799 அக்டோபர் 16 அன்று திருநெல்வேலிக்கு அருகிலுள்ள கயத்தாறு பழைய கோட்டைக்கு முன்பிருந்த புளியமரத்தில் வீரபாண்டிய கட்டபொம்மன் தூக்கிலிடப்பட்டார்.',
  },
  {
    id: 122,
    category: 'வரலாறு • சோழர் கட்டிடக்கலை',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 2',
    topic: 'வரலாறு',
    question_ta: 'தஞ்சை பெரிய கோயிலை (பிரகதீஸ்வரர் ஆலயம்) கி.பி. 1010-ல் கட்டி முடித்த சோழப் பேரரசர் யார்?',
    question_en: 'Which Chola emperor completed the construction of the Thanjavur Big Temple in 1010 AD?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'முதலாம் இராஜேந்திர சோழன்', text_en: 'Rajendra Chola I' },
      { id: 'B', label: 'ஆ', text_ta: 'முதலாம் இராஜராஜ சோழன்', text_en: 'Rajaraja Chola I' },
      { id: 'C', label: 'இ', text_ta: 'குலோத்துங்க சோழன்', text_en: 'Kulothunga Chola' },
      { id: 'D', label: 'ஈ', text_ta: 'கரிகால் பெருவளத்தான்', text_en: 'Karikalan' },
    ],
    answer: 'B',
    explanation:
      'கி.பி. 1010-ல் முதலாம் இராஜராஜ சோழனால் கட்டி முடிக்கப்பட்ட தஞ்சைப் பெரிய கோயில் திராவிடக் கட்டிடக்கலையின் தலையாய சிகரமாகும்.',
  },
  {
    id: 123,
    category: 'வரலாறு • திராவிட இயக்கம்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'வரலாறு',
    question_ta: 'தென்னிந்திய நல உரிமைச் சங்கம் (நீதிக்கட்சி) தொடங்கப்பட்ட ஆண்டு எது?',
    question_en: 'In which year was the South Indian Liberal Federation (Justice Party) founded?',
    options: [
      { id: 'A', label: 'அ', text_ta: '1914', text_en: '1914' },
      { id: 'B', label: 'ஆ', text_ta: '1916', text_en: '1916' },
      { id: 'C', label: 'இ', text_ta: '1919', text_en: '1919' },
      { id: 'D', label: 'ஈ', text_ta: '1921', text_en: '1921' },
    ],
    answer: 'B',
    explanation:
      '1916 நவம்பர் 20 அன்று சென்னை விக்டோரியா பொது அரங்கில் சர் பிட்டி தியாகராயர், டாக்டர் டி.எம். நாயர் மற்றும் டாக்டர் நடேசனார் ஆகியோரால் நீதிக்கட்சி தொடங்கப்பட்டது.',
  },
  {
    id: 124,
    category: 'வரலாறு • சுயமரியாதை இயக்கம்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'வரலாறு',
    question_ta: 'தந்தை பெரியாரால் சுயமரியாதை இயக்கம் தொடங்கப்பட்ட ஆண்டு எது?',
    question_en: 'In which year was the Self-Respect Movement founded by Thanthai Periyar?',
    options: [
      { id: 'A', label: 'அ', text_ta: '1920', text_en: '1920' },
      { id: 'B', label: 'ஆ', text_ta: '1925', text_en: '1925' },
      { id: 'C', label: 'இ', text_ta: '1930', text_en: '1930' },
      { id: 'D', label: 'ஈ', text_ta: '1937', text_en: '1937' },
    ],
    answer: 'B',
    explanation:
      'காங்கிரஸ் கட்சியிலிருந்து வெளியேறிய தந்தை பெரியார் 1925-ல் தீண்டாமை ஒழிப்பு, பெண் விடுதலை மற்றும் பகுத்தறிவை அடிப்படையாகக் கொண்ட சுயமரியாதை இயக்கத்தைத் தோற்றுவித்தார்.',
  },

  // 5. கணிதம் & நுண்ணறிவு (Maths & Aptitude)
  {
    id: 125,
    category: 'கணிதம் • தனிவட்டி',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'கணிதம்',
    question_ta: 'ஒரு தொகையானது தனிவட்டி முறையில் 10 ஆண்டுகளில் இரட்டிப்பாகிறது எனில், ஆண்டு வட்டி வீதம் என்ன?',
    question_en: 'A sum of money doubles itself in 10 years at simple interest. What is the annual rate of interest?',
    options: [
      { id: 'A', label: 'அ', text_ta: '8%', text_en: '8%' },
      { id: 'B', label: 'ஆ', text_ta: '10%', text_en: '10%' },
      { id: 'C', label: 'இ', text_ta: '12%', text_en: '12%' },
      { id: 'D', label: 'ஈ', text_ta: '15%', text_en: '15%' },
    ],
    answer: 'B',
    explanation:
      'சூத்திரம்: R = (N - 1) * 100 / T. இங்கு மடங்கு N = 2, காலம் T = 10 ஆண்டுகள். ஆகவே R = (2 - 1) * 100 / 10 = 10%.',
  },
  {
    id: 126,
    category: 'கணிதம் • மீ.பொ.வ (HCF)',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'கணிதம்',
    question_ta: '12, 18, 24 ஆகிய எண்களின் மீப்பெரு பொது வகுத்தி (HCF) யாது?',
    question_en: 'What is the Highest Common Factor (HCF) of 12, 18, and 24?',
    options: [
      { id: 'A', label: 'அ', text_ta: '4', text_en: '4' },
      { id: 'B', label: 'ஆ', text_ta: '6', text_en: '6' },
      { id: 'C', label: 'இ', text_ta: '12', text_en: '12' },
      { id: 'D', label: 'ஈ', text_ta: '72', text_en: '72' },
    ],
    answer: 'B',
    explanation:
      '12 = 2 * 2 * 3; 18 = 2 * 3 * 3; 24 = 2 * 2 * 2 * 3. மூன்று எண்களிலும் பொதுவாக உள்ள காரணிகள் 2 * 3 = 6 ஆகும்.',
  },
  {
    id: 127,
    category: 'கணிதம் • காலம் & வேலை',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 2',
    topic: 'கணிதம்',
    question_ta:
      'A ஒரு வேலையை 12 நாட்களில் முடிப்பார். B அதே வேலையை 24 நாட்களில் முடிப்பார். இருவரும் சேர்ந்து அவ்வேலையை எத்தனை நாட்களில் முடிப்பர்?',
    question_en:
      'A can do a piece of work in 12 days and B can do it in 24 days. How many days will they take together?',
    options: [
      { id: 'A', label: 'அ', text_ta: '6 நாட்கள்', text_en: '6 days' },
      { id: 'B', label: 'ஆ', text_ta: '8 நாட்கள்', text_en: '8 days' },
      { id: 'C', label: 'இ', text_ta: '10 நாட்கள்', text_en: '10 days' },
      { id: 'D', label: 'ஈ', text_ta: '18 நாட்கள்', text_en: '18 days' },
    ],
    answer: 'B',
    explanation:
      'இருவரின் ஒரு நாள் வேலை = 1/12 + 1/24 = (2 + 1) / 24 = 3/24 = 1/8. எனவே இருவரும் இணைந்து அவ்வேலையை 8 நாட்களில் முடிப்பர்.',
  },
  {
    id: 128,
    category: 'கணிதம் • அளவியல்',
    exam: 'TNPSC',
    year: 2021,
    paper: 'VAO',
    topic: 'கணிதம்',
    question_ta: 'ஒரு வட்டத்தின் ஆரம் 14 செ.மீ எனில் அதன் பரப்பளவு யாது? (π = 22/7)',
    question_en: 'If the radius of a circle is 14 cm, what is its area? (π = 22/7)',
    options: [
      { id: 'A', label: 'அ', text_ta: '88 ச.செ.மீ', text_en: '88 sq.cm' },
      { id: 'B', label: 'ஆ', text_ta: '616 ச.செ.மீ', text_en: '616 sq.cm' },
      { id: 'C', label: 'இ', text_ta: '308 ச.செ.மீ', text_en: '308 sq.cm' },
      { id: 'D', label: 'ஈ', text_ta: '154 ச.செ.மீ', text_en: '154 sq.cm' },
    ],
    answer: 'B',
    explanation:
      'வட்டத்தின் பரப்பளவு = π * r^2 = (22/7) * 14 * 14 = 22 * 2 * 14 = 616 சதுர செ.மீ ஆகும்.',
  },
  {
    id: 129,
    category: 'கணிதம் • எண் தொடர்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'கணிதம்',
    question_ta: 'அடுத்த எண்ணைக் காண்க: 2, 6, 12, 20, 30, ?',
    question_en: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    options: [
      { id: 'A', label: 'அ', text_ta: '40', text_en: '40' },
      { id: 'B', label: 'ஆ', text_ta: '42', text_en: '42' },
      { id: 'C', label: 'இ', text_ta: '44', text_en: '44' },
      { id: 'D', label: 'ஈ', text_ta: '48', text_en: '48' },
    ],
    answer: 'B',
    explanation:
      'தொடரின் அமைப்பு: 1*2=2, 2*3=6, 3*4=12, 4*5=20, 5*6=30. ஆகவே அடுத்த எண் 6*7 = 42 (அல்லது இடைவெளி +4, +6, +8, +10, +12 -> 30 + 12 = 42).',
  },
  {
    id: 130,
    category: 'கணிதம் • சராசரி',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'கணிதம்',
    question_ta: '5 நபர்களின் சராசரி வயது 25 ஆண்டுகள். அவர்களுடன் புதிய ஒருவர் சேரும் போது சராசரி வயது 27 ஆக உயர்கிறது எனில், புதிய நபரின் வயது என்ன?',
    question_en: 'The average age of 5 persons is 25 years. When a new person joins, the average becomes 27. What is the age of the new person?',
    options: [
      { id: 'A', label: 'அ', text_ta: '35 ஆண்டுகள்', text_en: '35 years' },
      { id: 'B', label: 'ஆ', text_ta: '37 ஆண்டுகள்', text_en: '37 years' },
      { id: 'C', label: 'இ', text_ta: '39 ஆண்டுகள்', text_en: '39 years' },
      { id: 'D', label: 'ஈ', text_ta: '41 ஆண்டுகள்', text_en: '41 years' },
    ],
    answer: 'B',
    explanation:
      '5 நபர்களின் மொத்த வயது = 5 * 25 = 125. புதியவருடன் 6 நபர்களின் மொத்த வயது = 6 * 27 = 162. ஆகவே புதிய நபரின் வயது = 162 - 125 = 37 ஆண்டுகள்.',
  },

  // 6. பொது அறிவு & அறிவியல் (GK & General Science)
  {
    id: 131,
    category: 'பொது அறிவு • விண்வெளி & அறிவியல்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'பொது அறிவு',
    question_ta: 'இஸ்ரோவால் வெற்றிகரமாக நிலவின் தென் துருவத்தில் தரையிறக்கப்பட்ட விண்கலம் எது?',
    question_en: 'Which ISRO spacecraft successfully soft-landed on the Moon’s South Pole?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'சந்திரயான்-1', text_en: 'Chandrayaan-1' },
      { id: 'B', label: 'ஆ', text_ta: 'சந்திரயான்-2', text_en: 'Chandrayaan-2' },
      { id: 'C', label: 'இ', text_ta: 'சந்திரயான்-3', text_en: 'Chandrayaan-3' },
      { id: 'D', label: 'ஈ', text_ta: 'ஆதித்யா L1', text_en: 'Aditya L1' },
    ],
    answer: 'C',
    explanation:
      '2023 ஆகஸ்ட் 23 அன்று சந்திரயான்-3 விண்கலத்தின் விக்ரம் லேண்டர் நிலவின் தென் துருவத்தில் வெற்றிகரமாக மென்தரையிறங்கி இந்தியாவுக்குப் பெருமை சேர்த்தது.',
  },
  {
    id: 132,
    category: 'பொது அறிவியல் • மனித உடலியல்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 2',
    topic: 'பொது அறிவு',
    question_ta: "மனித உடலின் 'வேதித் தொழிற்சாலை' (Chemical Factory) என்று அழைக்கப்படும் உறுப்பு எது?",
    question_en: "Which organ is known as the 'Chemical Factory' of the human body?",
    options: [
      { id: 'A', label: 'அ', text_ta: 'இதயம் (Heart)', text_en: 'Heart' },
      { id: 'B', label: 'ஆ', text_ta: 'கல்லீரல் (Liver)', text_en: 'Liver' },
      { id: 'C', label: 'இ', text_ta: 'சிறுநீரகம் (Kidney)', text_en: 'Kidney' },
      { id: 'D', label: 'ஈ', text_ta: 'நுரையீரல் (Lungs)', text_en: 'Lungs' },
    ],
    answer: 'B',
    explanation:
      'கல்லீரல் உடலில் பித்தநீர் சுரத்தல், நச்சு முறித்தல், குளுக்கோஸ் சேமிப்பு உட்பட 500-க்கும் மேற்பட்ட முக்கிய உயிர்வேதியியல் வினைகளை மேற்கொள்வதால் உடலின் வேதித் தொழிற்சாலை எனப்படுகிறது.',
  },
  {
    id: 133,
    category: 'பொது அறிவியல் • இயற்பியல்',
    exam: 'TNPSC',
    year: 2021,
    paper: 'VAO',
    topic: 'பொது அறிவு',
    question_ta: 'சூரியனின் ஒளிக்கதிர்கள் பூமியை வந்தடைய எடுத்துக்கொள்ளும் தோராயமான நேரம் எவ்வளவு?',
    question_en: 'Approximately how much time does sunlight take to reach Earth?',
    options: [
      { id: 'A', label: 'அ', text_ta: '500 வினாடிகள் (8 நிமி 20 விநாடி)', text_en: '500 seconds (8 min 20 sec)' },
      { id: 'B', label: 'ஆ', text_ta: '300 வினாடிகள் (5 நிமிடம்)', text_en: '300 seconds' },
      { id: 'C', label: 'இ', text_ta: '8 வினாடிகள்', text_en: '8 seconds' },
      { id: 'D', label: 'ஈ', text_ta: '600 வினாடிகள் (10 நிமிடம்)', text_en: '600 seconds' },
    ],
    answer: 'A',
    explanation:
      'ஒளியின் வேகம் வினாடிக்கு 3,00,000 கி.மீ ஆகும். சூரியனுக்கும் பூமிக்கும் இடையிலான 150 மில்லியன் கி.மீ தூரத்தைக் கடக்க சூரிய ஒளிக்கு சுமார் 8 நிமிடங்கள் 20 வினாடிகள் (500 வினாடிகள்) ஆகிறது.',
  },
  {
    id: 134,
    category: 'பொது அறிவு • தமிழ்நாடு புவியியல்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 4',
    topic: 'பொது அறிவு',
    question_ta: 'தமிழ்நாடு மாநிலத்தின் மாநில விலங்கு எது?',
    question_en: 'Which is the State Animal of Tamil Nadu?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'நாட்டு யானை', text_en: 'Asian Elephant' },
      { id: 'B', label: 'ஆ', text_ta: 'வரையாடு (Nilgiri Tahr)', text_en: 'Nilgiri Tahr' },
      { id: 'C', label: 'இ', text_ta: 'புள்ளி மான்', text_en: 'Spotted Deer' },
      { id: 'D', label: 'ஈ', text_ta: 'பனை அணில்', text_en: 'Grizzled Giant Squirrel' },
    ],
    answer: 'B',
    explanation:
      'மேற்குத் தொடர்ச்சி மலைப்பகுதிகளில் மட்டுமே வசிக்கக்கூடிய அழிந்துவரும் அரிய வனவிலங்கான வரையாடு (நீலகிரி வரையாடு) தமிழ்நாட்டின் மாநில விலங்காகும்.',
  },
  {
    id: 135,
    category: 'பொது அறிவு • சுற்றுச்சூழல்',
    exam: 'TNPSC',
    year: 2022,
    paper: 'Group 4',
    topic: 'பொது அறிவு',
    question_ta: 'உலக சுற்றுச்சூழல் தினம் ஆண்டுதோறும் எந்த நாளில் கடைப்பிடிக்கப்படுகிறது?',
    question_en: 'On which day is World Environment Day observed every year?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'ஏப்ரல் 22 (April 22)', text_en: 'April 22' },
      { id: 'B', label: 'ஆ', text_ta: 'ஜூன் 5 (June 5)', text_en: 'June 5' },
      { id: 'C', label: 'இ', text_ta: 'செப்டம்பர் 16 (September 16)', text_en: 'September 16' },
      { id: 'D', label: 'ஈ', text_ta: 'டிசம்பர் 1 (December 1)', text_en: 'December 1' },
    ],
    answer: 'B',
    explanation:
      'ஐக்கிய நாடுகள் சபையின் வழிகாட்டுதலில் 1974 முதல் ஆண்டுதோறும் ஜூன் 5-ஆம் தேதி உலக சுற்றுச்சூழல் தினமாகக் கொண்டாடப்பட்டு விழிப்புணர்வு ஏற்படுத்தப்படுகிறது.',
  },
  {
    id: 136,
    category: 'பொது அறிவு • இந்திய நிர்வாகம்',
    exam: 'TNPSC',
    year: 2023,
    paper: 'Group 2',
    topic: 'பொது அறிவு',
    question_ta: 'சுதந்திர இந்தியாவின் முதல் தலைமைத் தேர்தல் ஆணையராகப் பணியாற்றியவர் யார்?',
    question_en: 'Who served as the first Chief Election Commissioner of independent India?',
    options: [
      { id: 'A', label: 'அ', text_ta: 'டி.என். சேஷன் (T.N. Seshan)', text_en: 'T.N. Seshan' },
      { id: 'B', label: 'ஆ', text_ta: 'சுகுமார் சென் (Sukumar Sen)', text_en: 'Sukumar Sen' },
      { id: 'C', label: 'இ', text_ta: 'கே.வி.கே. சுந்தரம்', text_en: 'K.V.K. Sundaram' },
      { id: 'D', label: 'ஈ', text_ta: 'எஸ்.பி. சென் வர்மா', text_en: 'S.P. Sen Verma' },
    ],
    answer: 'B',
    explanation:
      '1950 முதல் 1958 வரை இந்தியாவின் முதல் தலைமைத் தேர்தல் ஆணையராகப் பணியாற்றிய சுகுமார் சென், சுதந்திர இந்தியாவின் 1951-52 முதல் பொதுத்தேர்தலை வெற்றிகரமாக நடத்திக் காட்டினார்.',
  },
];

/**
 * Authentic Mock User matching Stitch Screen 4 Profile
 */
export const mockUser: User = {
  id: 1,
  name: 'அன்பழகன் (Anbazhagan)',
  phone: '9876543210',
  email: 'anbazhagan.tnpsc@gmail.com',
  aspirant_id: 'TNPSC-2024-8932',
  target_exam: 'TNPSC Group 4 & VAO 2024',
  created_at: '2024-01-01T00:00:00.000Z',
};

/**
 * Initial 7-day streak state
 */
export const initialStreak: StreakInfo = {
  current: 7,
  best: 21,
  last_date: '2024-11-14',
  is_completed_today: false,
};

/**
 * 14-day Practice Activity Heatmap Grid data (matching Stitch Screen 4 7x2 grid)
 */
export const mockHeatmapDays: HeatmapDay[] = [
  { day_index: 1, day_name: 'திங்கள்', day_short: 'தி', date: '2024-11-01', level: 3, score: 8, total: 10, status: 'completed' },
  { day_index: 2, day_name: 'செவ்வாய்', day_short: 'செ', date: '2024-11-02', level: 4, score: 10, total: 10, status: 'completed' },
  { day_index: 3, day_name: 'புதன்', day_short: 'பு', date: '2024-11-03', level: 2, score: 6, total: 10, status: 'completed' },
  { day_index: 4, day_name: 'வியாழன்', day_short: 'வி', date: '2024-11-04', level: 4, score: 9, total: 10, status: 'completed' },
  { day_index: 5, day_name: 'வெள்ளி', day_short: 'வெ', date: '2024-11-05', level: 4, score: 9, total: 10, status: 'completed' },
  { day_index: 6, day_name: 'சனி', day_short: 'ச', date: '2024-11-06', level: 4, score: 10, total: 10, status: 'completed' },
  { day_index: 7, day_name: 'ஞாயிறு', day_short: 'ஞா', date: '2024-11-07', level: 1, score: 4, total: 10, status: 'completed' },
  { day_index: 8, day_name: 'திங்கள்', day_short: 'தி', date: '2024-11-08', level: 4, score: 9, total: 10, status: 'completed' },
  { day_index: 9, day_name: 'செவ்வாய்', day_short: 'செ', date: '2024-11-09', level: 4, score: 9, total: 10, status: 'completed' },
  { day_index: 10, day_name: 'புதன்', day_short: 'பு', date: '2024-11-10', level: 4, score: 10, total: 10, status: 'completed' },
  { day_index: 11, day_name: 'வியாழன்', day_short: 'வி', date: '2024-11-11', level: 3, score: 7, total: 10, status: 'completed' },
  { day_index: 12, day_name: 'வெள்ளி', day_short: 'வெ', date: '2024-11-12', level: 4, score: 10, total: 10, status: 'completed' },
  { day_index: 13, day_name: 'சனி', day_short: 'இன்று', date: '2024-11-13', level: 0, score: 0, total: 10, status: 'pending' },
  { day_index: 14, day_name: 'ஞாயிறு', day_short: 'நாளை', date: '2024-11-14', level: 0, score: 0, total: 0, status: 'upcoming' },
];

/**
 * Initial Progress Statistics
 */
export const mockProgress: ProgressStats = {
  user_id: 1,
  streak: initialStreak,
  stats: {
    accuracy_percentage: 84,
    questions_solved: 1420,
    total_attempted: 1690,
    target_exam: 'TNPSC Group 4 & VAO 2024',
    days_remaining: 45,
    completion_percentage: 64,
  },
  heatmap: mockHeatmapDays,
};

/**
 * PYQ Question Papers (Group 4 2023, Group 2 2022, VAO 2021)
 */
export const mockPyqs: PyqItem[] = [
  {
    id: 'pyq_group4_2023',
    title: 'TNPSC Group 4 - 2023 வினாத்தாள்',
    year: 2023,
    exam: 'TNPSC',
    paper: 'Group 4',
    total_questions: 200,
    description: 'அசல் தேர்வு வினாத்தாள் • பொதுத்தமிழ் மற்றும் பொது அறிவு',
    tag: 'Group 4 2023',
    category: 'group4',
    is_bookmarked: false,
  },
  {
    id: 'pyq_group2_2022',
    title: 'TNPSC Group 2 / 2A - 2022 வினாத்தாள்',
    year: 2022,
    exam: 'TNPSC',
    paper: 'Group 2',
    total_questions: 175,
    description: 'அசல் தேர்வு வினாத்தாள் • மொழி மற்றும் பொது அறிவுத் தாள்',
    tag: 'Group 2 2022',
    category: 'group2',
    is_bookmarked: false,
  },
  {
    id: 'pyq_vao_2021',
    title: 'TNPSC VAO Exam - 2021 வினாத்தாள்',
    year: 2021,
    exam: 'TNPSC',
    paper: 'VAO',
    total_questions: 150,
    description: 'கிராம நிர்வாக அலுவலர் பிரத்யேக வினாத்தாள் மற்றும் தீர்வுகள்',
    tag: 'VAO 2021',
    category: 'vao',
    is_bookmarked: false,
  },
];

/**
 * Topic Items matching the Syllabus Cards and Practice Screen
 */
export const mockTopics: TopicItem[] = [
  {
    id: 'topic_tamil_grammar',
    title: 'தமிழ் இலக்கணம்',
    subtitle: 'எழுத்து, சொல், பொருள், யாப்பு, அணி',
    total_questions: 450,
    completed_percentage: 0,
    icon: 'spellcheck',
    category: 'tamil',
    tag: 'Group 4 சிறப்புப் பகுதி',
    is_bookmarked: false,
  },
  {
    id: 'topic_tamil_literature',
    title: 'தமிழ் இலக்கியம்',
    subtitle: 'சங்க இலக்கியம், திருக்குறள், காப்பியங்கள்',
    total_questions: 520,
    completed_percentage: 0,
    icon: 'menu_book',
    category: 'tamil',
    tag: 'அனைத்து TNPSC தேர்வுகள்',
    is_bookmarked: false,
  },
  {
    id: 'topic_polity',
    title: 'இந்திய அரசியல் (Indian Polity)',
    subtitle: 'அரசியலமைப்பு சட்டம், அடிப்படை உரிமைகள், நாடாளுமன்றம்',
    total_questions: 380,
    completed_percentage: 0,
    icon: 'account_balance',
    category: 'polity',
    tag: 'Unit 5 சிறப்புப் பகுதி',
    is_bookmarked: false,
  },
  {
    id: 'topic_history',
    title: 'வரலாறு & தமிழ்நாடு பண்பாடு',
    subtitle: 'சிந்து சமவெளி, சங்க காலம், விடுதலைப் போராட்டம்',
    total_questions: 410,
    completed_percentage: 0,
    icon: 'history_edu',
    category: 'history',
    tag: 'Unit 8 & Unit 9',
    is_bookmarked: false,
  },
  {
    id: 'topic_maths',
    title: 'கணிதம் & திறனறிதல் (Maths & Aptitude)',
    subtitle: 'தனிவட்டி, கூட்டுவட்டி, பரப்பளவு, மீ.பொ.வ',
    total_questions: 350,
    completed_percentage: 0,
    icon: 'calculate',
    category: 'maths',
    tag: '25 மதிப்பெண்கள் உறுதி',
    is_bookmarked: false,
  },
  {
    id: 'topic_gk_science',
    title: 'பொது அறிவியல் & நடப்பு நிகழ்வுகள்',
    subtitle: 'இயற்பியல், உயிரியல், நடப்பு நிகழ்வுகள் 2024',
    total_questions: 400,
    completed_percentage: 0,
    icon: 'science',
    category: 'gk',
    tag: 'பொது அறிவு பகுதி',
    is_bookmarked: false,
  },
];
