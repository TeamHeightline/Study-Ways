import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../app/redux-store/hooks';
import {
  CardContentType,
  CardHardLevel,
} from '../../../../shared/server-layer/types/card.types';
export type cardContentType = CardContentType | 'undefined';
export interface CardSelectorState {
  activePage: number;
  searching_string: string;
  hardLevel: CardHardLevel | 'undefined';
  authorID?: number;
  contentType: cardContentType;
  cardConnectedTheme?: number;
  selectedCardID?: number | string;
  mode?: 'onlyCreatedByMe' | 'standard';
}
const initialState: CardSelectorState = {
  activePage: 1,
  searching_string: '',
  hardLevel: 'undefined',
  contentType: 'undefined',
};
const slice = createSlice({
  name: 'cardSelector',
  initialState,
  reducers: {
    filtersChanged(state, action: PayloadAction<Partial<CardSelectorState>>) {
      Object.assign(state, action.payload);
      state.activePage = 1;
    },
    pageChanged(state, action: PayloadAction<number>) {
      state.activePage = action.payload;
    },
    cardSelected(state, action: PayloadAction<number | string | undefined>) {
      state.selectedCardID = action.payload;
    },
    modeChanged(state, action: PayloadAction<CardSelectorState['mode']>) {
      state.mode = action.payload;
    },
    resetFilters: () => initialState,
  },
});
export const cardSelectorActions = slice.actions;
export default slice.reducer;
export function useCardSelector() {
  const state = useAppSelector(state => state.cardSelector);
  const dispatch = useAppDispatch();
  return {
    ...state,
    setFilters: (fields: Partial<CardSelectorState>) =>
      dispatch(slice.actions.filtersChanged(fields)),
    changeActivePage: (_: unknown, page: number) =>
      dispatch(slice.actions.pageChanged(page)),
    changeSearchString: (e: any) =>
      dispatch(
        slice.actions.filtersChanged({ searching_string: e.target.value }),
      ),
    changeAuthor: (id: string | null) =>
      dispatch(
        slice.actions.filtersChanged({ authorID: id ? Number(id) : undefined }),
      ),
    changeHardLevel: (e: any) =>
      dispatch(slice.actions.filtersChanged({ hardLevel: e.target.value })),
    changeContentType: (e: any) =>
      dispatch(slice.actions.filtersChanged({ contentType: e.target.value })),
    selectCard: (id?: number | string) =>
      dispatch(slice.actions.cardSelected(id)),
    setMode: (mode: CardSelectorState['mode']) =>
      dispatch(slice.actions.modeChanged(mode)),
  };
}
