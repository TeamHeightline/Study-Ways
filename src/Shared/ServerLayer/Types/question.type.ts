export interface QuestionAuthorI {
  user_id: 528;
  firstname: string;
  lastname: string;
  avatar_src: string;
  study_in_id: string;
}

export interface IQuestionPreviewData {
  id: string;
  text: string;
  themeString: string;
  questionAuthor: {
    id: string;
    fullName: string;
  };
}

export interface IAnswerImage {
  owner_answer_id: number;
  image: string;
}

export interface IAnswer {
  id: number;
  is_true: boolean;
  text: string;
  help_textV1: string;
  help_textV2: string;
  help_textV3: string;
  video_url: string | null;
  check_queue: number;
  hard_level_of_answer: "MEDIUM" | "HARD" | "EASY";
  created_by_id: number;
  question_id: number;
  is_deleted: boolean;
  is_invisible: boolean;
  is_required: boolean;
  is_image_deleted: boolean;
  only_for_exam: boolean;
  usertests_answerimage?: IAnswerImage;
}

export interface IQuestionImage {
  owner_question_id: number;
  image: string;
}

export interface IQuestionWithAnswers {
  id: number;
  text: string;
  video_url: string;
  created_by_id: number;
  isImageQuestion: boolean;
  number_of_showing_answers: number;
  connected_theme_id: number | null;
  usertests_questionimage?: IQuestionImage;
  usertests_answer: IAnswer[];
}
