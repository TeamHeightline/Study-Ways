import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/hooks';
import { useUserSession } from '../../../../../shared/store/user-store/user-session';
import { cardContentType } from '../../../selector/store/CardSelectorStore';
import {
  selectRecommendedCardReport,
  useGetAIRecommendationsQuery,
} from './Query';
interface SearchState {
  AISearchString: string;
  submittedString: string;
  hardLevel: '-1' | '0' | '1' | '2' | '3';
  themeWithPatentIDArray: string[];
  cardConnectedTheme?: number;
  contentType: cardContentType;
  selectedCardAuthor?: number;
}
const initialState: SearchState = {
  AISearchString: '',
  submittedString: '',
  hardLevel: '-1',
  themeWithPatentIDArray: [],
  contentType: 'undefined',
};
const slice = createSlice({
  name: 'aiSearch',
  initialState,
  reducers: {
    changed(state, action: PayloadAction<Partial<SearchState>>) {
      Object.assign(state, action.payload);
    },
    themeChanged(state, action: PayloadAction<{ id?: number; ids: string[] }>) {
      state.cardConnectedTheme = action.payload.id;
      if (
        state.themeWithPatentIDArray.join(',') !== action.payload.ids.join(',')
      )
        state.themeWithPatentIDArray = action.payload.ids;
    },
    submitted(state) {
      state.submittedString = state.AISearchString;
    },
    resetFilters: () => initialState,
  },
});
export const aiSearchActions = slice.actions;
export default slice.reducer;
export function getAIQueryFilter(s: SearchState) {
  const filters: string[] = [];
  if (s.hardLevel !== '-1') filters.push("'hard_level' == " + s.hardLevel);
  if (s.themeWithPatentIDArray.length)
    filters.push(
      '({' +
        s.themeWithPatentIDArray.map(id => JSON.stringify(id)).join(', ') +
        "} & 'connected_theme') != {}",
    );
  if (s.contentType !== 'undefined')
    filters.push("'card_content_type' == " + Number(s.contentType));
  if (s.selectedCardAuthor !== undefined)
    filters.push("'created_by_id' == " + s.selectedCardAuthor);
  return filters.join(' and ');
}
export function useAISearch({ results = false, suggestions = false } = {}) {
  const state = useAppSelector(s => s.aiSearch);
  const dispatch = useAppDispatch();
  const session = useUserSession();
  const [debounced, setDebounced] = useState(state.AISearchString);
  useEffect(() => {
    if (!suggestions) return;
    const timer = setTimeout(() => setDebounced(state.AISearchString), 500);
    return () => clearTimeout(timer);
  }, [state.AISearchString, suggestions]);
  const filter = getAIQueryFilter(state);
  const userId = String(session.recommendationUserId || '-1');
  const matches = useGetAIRecommendationsQuery(
    { search: state.submittedString, filter, count: 50, userId },
    { skip: !results },
  );
  const autocomplete = useGetAIRecommendationsQuery(
    { search: debounced, filter, count: 10, userId },
    { skip: !suggestions },
  );
  const patch = (fields: Partial<SearchState>) =>
    dispatch(slice.actions.changed(fields));
  return {
    ...state,
    AIQueryFilterString: filter,
    cardsIDArray: matches.currentData?.recomms.map(r => r.id) || [],
    cardDataForAutocomplete:
      autocomplete.currentData?.recomms.map(r => ({
        id: r.id,
        label: r.values?.title || r.id,
      })) || [],
    isLoading: matches.isFetching,
    isError: matches.isError,
    retry: matches.refetch,
    changeAISearchString: (value: string) => patch({ AISearchString: value }),
    getAISearchResult: () => dispatch(slice.actions.submitted()),
    changeHardLevel: (e: any) => patch({ hardLevel: e.target.value }),
    changeContentType: (e: any) => patch({ contentType: e.target.value }),
    changeCardAuthor: (value: { id: number } | null) =>
      patch({ selectedCardAuthor: value?.id }),
    setThemeFilter: (id: number | undefined, ids: string[]) =>
      dispatch(slice.actions.themeChanged({ id, ids })),
    onSelectCardInAutocomplete: (
      _: unknown,
      value: string | { id: string; label: string } | null,
    ) => {
      if (!value) return;
      const text = typeof value === 'string' ? value : value.label;
      patch({ AISearchString: text, submittedString: text });
      if (typeof value !== 'string')
        void selectRecommendedCardReport(
          autocomplete.currentData?.recommId || '',
          value.id,
          userId,
        ).catch(() => {});
    },
  };
}
