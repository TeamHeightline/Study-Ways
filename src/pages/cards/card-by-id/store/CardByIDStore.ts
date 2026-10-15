import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useId, useRef } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../app/redux-store/hooks';
import {
  useSetCardBookmarkMutation,
  useSetCardRatingMutation,
} from '../../../../shared/server-layer/query-layer/write-api';
import { cardImageUrl } from '../../shared/card-image-url';
import { ICardData } from '../types/card-data';
interface CardViewState {
  is_test_in_card_closed: boolean;
  isOpenGoToTestDialogAfterVideo: boolean;
}
const empty: CardViewState = {
  is_test_in_card_closed: false,
  isOpenGoToTestDialogAfterVideo: false,
};
const slice = createSlice({
  name: 'cardView',
  initialState: {} as Record<string, CardViewState>,
  reducers: {
    changed(
      state,
      action: PayloadAction<{ key: string; patch: Partial<CardViewState> }>,
    ) {
      state[action.payload.key] = {
        ...(state[action.payload.key] || empty),
        ...action.payload.patch,
      };
    },
    released(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});
export default slice.reducer;
export function useCardView(
  id: number | undefined,
  card_data: ICardData | undefined,
  reload: () => unknown,
) {
  const instance = useId();
  const key = instance + ':' + id;
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.cardView[key] || empty);
  const testElementRef = useRef<HTMLDivElement>(null);
  const [bookmark] = useSetCardBookmarkMutation();
  const [rate] = useSetCardRatingMutation();
  useEffect(
    () => () => {
      dispatch(slice.actions.released(key));
    },
    [dispatch, key],
  );
  const image = card_data?.cards_cardimage?.image;
  return {
    ...state,
    id,
    card_data,
    testElementRef,
    cardImageURLForUI: card_data?.id ? cardImageUrl(card_data.id, image) : '',
    loadCardData: reload,
    setView: (patch: Partial<CardViewState>) =>
      dispatch(slice.actions.changed({ key, patch })),
    removeCardFromBookmark: () =>
      id ? bookmark({ id, bookmarked: false }).unwrap() : Promise.resolve(),
    addToBookmark: () =>
      id ? bookmark({ id, bookmarked: true }).unwrap() : Promise.resolve(),
    setRating: (rating: number | null) =>
      id ? rate({ id, rating }).unwrap() : Promise.resolve(),
  };
}
export type CardByIDStore = ReturnType<typeof useCardView>;
