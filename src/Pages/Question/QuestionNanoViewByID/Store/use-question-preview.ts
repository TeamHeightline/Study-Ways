import { useEffect, useMemo } from 'react';
import { runInAction } from 'mobx';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetQuestionPreviewQuery } from '../../question-read-api';
import { QuestionNanoViewByIdStore } from './question-nano-view-by-id-store';
export function useQuestionPreview(id: number) {
  const state = useMemo(() => new QuestionNanoViewByIdStore(id), [id]);
  const query = useGetQuestionPreviewQuery(
    Number.isInteger(id) && id > 0 ? id : skipToken,
  );
  useEffect(() => {
    runInAction(() => {
      state.id = id;
      state.text = query.currentData?.text;
      state.owner_username = query.currentData?.ownerUsername;
      state.questionImage = query.currentData?.questionImage ?? undefined;
      state.dataHasBeenLoaded = !!query.currentData;
      state.hasLoadError = query.isError || query.currentData === null;
      state.reload = query.refetch;
    });
  }, [id, query.currentData, query.isError, query.refetch, state]);
  return state;
}
