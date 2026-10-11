import type { WrittenAnswer } from './write-api';
import type { EditorAnswer } from '../../../Pages/Question/question-read-api';

export function answerWriteData(answer: any) {
  return {
    text: answer.text ?? '',
    is_true: answer.isTrue === true || answer.isTrue === 'true',
    help_textV1: answer.helpTextv1 ?? null,
    help_textV2: answer.helpTextv2 ?? null,
    help_textV3: answer.helpTextv3 ?? null,
    check_queue: Number(answer.checkQueue),
    hard_level_of_answer: answer.hardLevelOfAnswer,
    is_deleted: !!answer.isDeleted,
    is_invisible: !!answer.isInvisible,
    is_required: !!answer.isRequired,
    is_image_deleted: !!answer.isImageDeleted,
    only_for_exam: !!answer.onlyForExam,
  };
}
export function writtenAnswerData(answer: WrittenAnswer): EditorAnswer {
  return {
    id: String(answer.id),
    question: { id: String(answer.question_id) },
    image: null,
    text: answer.text,
    isTrue: answer.is_true,
    helpTextv1: answer.help_textV1 ?? '',
    helpTextv2: answer.help_textV2 ?? '',
    helpTextv3: answer.help_textV3 ?? '',
    checkQueue: answer.check_queue,
    hardLevelOfAnswer:
      answer.hard_level_of_answer as EditorAnswer['hardLevelOfAnswer'],
    isDeleted: answer.is_deleted,
    isInvisible: answer.is_invisible,
    isRequired: answer.is_required,
    isImageDeleted: answer.is_image_deleted,
    onlyForExam: answer.only_for_exam,
  };
}
