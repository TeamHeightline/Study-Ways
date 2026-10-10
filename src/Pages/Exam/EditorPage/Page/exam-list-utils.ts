import { IExamDataWithQSData } from '../../../../Shared/ServerLayer/Types/exam.types';

export const examTitle = (exam: IExamDataWithQSData) =>
  exam.name?.trim() || `Экзамен №${exam.id}`;
export const sequenceTitle = (exam: IExamDataWithQSData) =>
  exam.question_sequence?.name?.trim() ||
  (exam.question_sequence_id
    ? `Серия №${exam.question_sequence_id}`
    : 'Серия не указана');

export function accessLabel(mode: string) {
  return (
    {
      open: 'Открытый',
      closed: 'Закрытый',
      password: 'По паролю',
      timeInterval: 'По расписанию',
      manual: 'Ручной доступ',
    }[mode] || 'Доступ не указан'
  );
}
export function matchesExam(exam: IExamDataWithQSData, search: string) {
  const normalize = (value: string) =>
    value.toLocaleLowerCase('ru').replace(/ё/g, 'е');
  const text = normalize(
    [
      exam.id,
      exam.name,
      exam.question_sequence_id,
      exam.question_sequence?.name,
    ].join(' '),
  );
  return normalize(search.trim())
    .split(/\s+/)
    .every(word => text.includes(word));
}
