/**
 * TNPSC தோழன் (ExamBuddy) - TypeScript Domain Models & API Contracts
 * Conforms to agent.md REST specifications, PROJECT.md contracts, and Stitch screen designs.
 */

export type OptionId = 'A' | 'B' | 'C' | 'D';
export type OptionLabelTamil = 'அ' | 'ஆ' | 'இ' | 'ஈ';

export interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  aspirant_id: string; // e.g. "TNPSC-2024-8932"
  target_exam: string; // e.g. "TNPSC Group 4 & VAO 2024"
  created_at: string;
}

export interface QuestionOption {
  id: OptionId;
  label: OptionLabelTamil;
  text_ta: string;
  text_en?: string;
}

export interface Question {
  id: number;
  category: string;
  exam: string;
  year: number;
  paper: string;
  topic: string;
  question_ta: string;
  question_en?: string;
  options: QuestionOption[];
  answer: OptionId;
  explanation: string;
  source_pdf?: string;
  review_status?: 'pending' | 'verified' | 'disputed';
}

export interface DailyQuizData {
  quiz_id: number;
  date: string; // YYYY-MM-DD in Asia/Kolkata
  title: string;
  subtitle: string;
  time_limit_seconds: number;
  total_questions: number;
  is_completed_today: boolean;
  questions: Question[];
}

export interface QuizSubmissionPayload {
  quiz_id: number;
  date: string; // YYYY-MM-DD in Asia/Kolkata
  time_taken_seconds: number;
  answers: {
    question_id: number;
    selected_option: OptionId;
  }[];
}

export interface DailyQuizResultItem {
  question_id: number;
  selected_option: OptionId;
  correct_option: OptionId;
  is_correct: boolean;
  explanation: string;
}

export interface StreakInfo {
  current: number;
  best: number;
  last_date: string; // YYYY-MM-DD
  is_completed_today?: boolean;
  incremented?: boolean;
}

export interface QuizSubmissionResult {
  score: number;
  total: number;
  accuracy_percentage: number;
  streak: StreakInfo;
  results: DailyQuizResultItem[];
}

export interface HeatmapDay {
  day_index: number;
  day_name: string; // e.g. "திங்கள்"
  day_short: string; // e.g. "தி", "செ", or "இன்று"
  date: string; // YYYY-MM-DD
  level: 0 | 1 | 2 | 3 | 4; // intensity (0: none, 4: max)
  score: number;
  total: number;
  status: 'completed' | 'pending' | 'missed' | 'upcoming';
}

export interface ProgressMetrics {
  accuracy_percentage: number;
  questions_solved: number;
  total_attempted: number;
  target_exam: string;
  days_remaining: number;
  completion_percentage: number;
}

export interface ProgressStats {
  user_id: number;
  streak: StreakInfo;
  stats: ProgressMetrics;
  heatmap: HeatmapDay[];
}

export interface TopicItem {
  id: string;
  title: string;
  subtitle: string;
  total_questions: number;
  completed_percentage: number;
  icon: string;
  category: string; // "tamil" | "polity" | "history" | "maths" | "science" | "gk"
  tag: string; // e.g. "Group 4 சிறப்புப் பகுதி"
  is_bookmarked?: boolean;
}

export interface PyqItem {
  id: string;
  title: string;
  year: number;
  exam: string;
  paper?: string;
  total_questions: number;
  description: string;
  tag: string;
  category: string;
  is_bookmarked?: boolean;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface QuestionQueryParams {
  exam?: string;
  year?: number;
  paper?: string;
  topic?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface AttemptResult {
  attempt_id: number;
  question_id: number;
  is_correct: boolean;
  correct_answer: OptionId;
  explanation: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time_seconds: number;
  streak: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Service Interface Contracts (matching PROJECT.md)
export interface IDailyQuizService {
  getTodayQuiz(): Promise<DailyQuizData>;
  submitQuiz(payload: QuizSubmissionPayload): Promise<QuizSubmissionResult>;
}

export interface IQuestionService {
  getQuestions(params?: QuestionQueryParams): Promise<{ data: Question[]; meta: PaginationMeta }>;
  submitAttempt(questionId: number, selectedOption: OptionId): Promise<AttemptResult>;
  getTopics(): Promise<TopicItem[]>;
  getPyqs(): Promise<PyqItem[]>;
}

export interface IProgressService {
  getProgress(): Promise<ProgressStats>;
  toggleBookmark(itemId: string, type: 'topic' | 'pyq' | 'question'): Promise<boolean>;
}
