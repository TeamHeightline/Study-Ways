import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useId, useMemo } from 'react';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../../../app/redux-store/hooks';
import { normalizeCourseData } from '../../../edit-course-by-id/course-data';
import { CourseReadData } from '../../../course-api';
import { FILE_URL } from '../../../../../settings';
export interface positionDataI {
  activePage: number;
  selectedPage?: number;
  selectedRow?: number;
  selectedIndex?: number;
}
interface NavigationState {
  positionData: positionDataI;
  isPositionChanged: boolean;
  viewedCardIDs: string[];
}
const empty: NavigationState = {
  positionData: { activePage: 1 },
  isPositionChanged: false,
  viewedCardIDs: [],
};
const slice = createSlice({
  name: 'courseNavigation',
  initialState: {} as Record<string, NavigationState>,
  reducers: {
    positionChanged(
      state,
      action: PayloadAction<{
        key: string;
        position: positionDataI;
        notify: boolean;
      }>,
    ) {
      const s = (state[action.payload.key] ||= { ...empty });
      s.positionData = action.payload.position;
      s.isPositionChanged = action.payload.notify;
    },
    acknowledged(state, action: PayloadAction<string>) {
      if (state[action.payload])
        state[action.payload].isPositionChanged = false;
    },
    viewed(state, action: PayloadAction<{ key: string; id: string }>) {
      const s = (state[action.payload.key] ||= { ...empty });
      if (!s.viewedCardIDs.includes(action.payload.id))
        s.viewedCardIDs.push(action.payload.id);
    },
    released(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});
export default slice.reducer;
export function useCourseNavigation(
  id: number,
  data: CourseReadData | null | undefined,
  ignore?: boolean,
) {
  const instance = useId();
  const key = instance + ':' + id;
  const dispatch = useAppDispatch();
  const state = useAppSelector(s => s.courseNavigation[key] || empty);
  useEffect(
    () => () => {
      dispatch(slice.actions.released(key));
    },
    [dispatch, key],
  );
  const course = useMemo(
    () => normalizeCourseData(data?.course_data),
    [data?.course_data],
  );
  const get_card_id_by_position = (position: positionDataI) =>
    course[position.selectedRow ?? -1]?.SameLine[
      (position.selectedPage ?? 0) - 1
    ]?.CourseFragment[position.selectedIndex ?? -1]?.CourseElement?.id ?? null;
  const getPositionByArrow = (arrow: 'Back' | 'Down' | 'Up' | 'Next') => {
    const p = { ...state.positionData };
    if (arrow === 'Back') p.selectedIndex = Number(p.selectedIndex) - 1;
    if (arrow === 'Next') p.selectedIndex = Number(p.selectedIndex) + 1;
    if (arrow === 'Up') p.selectedRow = Number(p.selectedRow) - 1;
    if (arrow === 'Down') p.selectedRow = Number(p.selectedRow) + 1;
    return p;
  };
  const setPosition = (position: positionDataI, notify = true) =>
    dispatch(slice.actions.positionChanged({ key, position, notify }));
  return {
    ...state,
    id,
    course,
    courseData: course,
    position: state.positionData,
    viewedCardIDs: new Set(state.viewedCardIDs),
    isIgnoreRouteAfterSelect: ignore,
    courseName:
      data?.name?.replace(/\[.*?\]/g, '') || 'Название курса по умолчанию',
    courseImage: data?.cards_cardcourseimage?.image
      ? FILE_URL + '/' + data.cards_cardcourseimage.image
      : undefined,
    author: data?.users_customuser || null,
    mainLineIndex: Number((data?.name || '').match(/\[(.*?)\]/)?.[1]) - 1,
    get_card_id_by_position,
    getPositionByArrow,
    getCardIDByArrow: (arrow: 'Back' | 'Down' | 'Up' | 'Next') =>
      get_card_id_by_position(getPositionByArrow(arrow)),
    setPosition,
    setActivePage: (activePage: number) =>
      setPosition({ ...state.positionData, activePage }),
    acknowledge: () => dispatch(slice.actions.acknowledged(key)),
    markViewed: (id: string) => dispatch(slice.actions.viewed({ key, id })),
  };
}
export type CourseMicroStoreByID = ReturnType<typeof useCourseNavigation>;
