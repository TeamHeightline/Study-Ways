import { skipToken } from '@reduxjs/toolkit/query';
import { useGetQuestionPreviewQuery } from '../../question/question-read-api';

export function useQuestionPreview(id: number) {
  const query = useGetQuestionPreviewQuery(
    Number.isInteger(id) && id > 0 ? id : skipToken,
  );
  return {
    id,
    text: query.currentData?.text,
    owner_username: query.currentData?.ownerUsername,
    questionImage: query.currentData?.questionImage,
    dataHasBeenLoaded: !!query.currentData,
    hasLoadError: query.isError || query.currentData === null,
    refetch: query.refetch,
  };
}

export type QuestionPreviewState = ReturnType<typeof useQuestionPreview>;
