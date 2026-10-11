import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge } from '@xyflow/react';
import { useAppDispatch, useAppSelector } from '../../../app/redux-store/hooks';
import { useUserSession } from '../../../shared/store/user-store/user-session';
import { aiCourseApi } from './api';
import { generateInitialNodes } from '../utils/generateInitialNodes';
import { generateNextNodes } from '../utils/generateNextNodes';
import { generateEdgesForNextNodes } from '../utils/generateEdgesForNextNodes';
import { getLayoutedElements } from '../utils/getLayoutElements';
interface CourseState {
  searchString: string;
  defaultCardIDs: number[];
  nodes: Node[];
  edges: Edge[];
  selectedDefaultCardID: number | null;
  selectedCardId: number | null;
  isSearchButtonClicked: boolean;
  isDefaultCardsLoaded: boolean;
  searchRequest?: string;
  branches: Record<string, string>;
  expanded: Record<string, boolean>;
  error: boolean;
}
const initialState: CourseState = {
  searchString: '',
  defaultCardIDs: [],
  nodes: [],
  edges: [],
  selectedDefaultCardID: null,
  selectedCardId: null,
  isSearchButtonClicked: false,
  isDefaultCardsLoaded: false,
  branches: {},
  expanded: {},
  error: false,
};
export const searchAICourse = createAsyncThunk(
  'aiCourse/search',
  async (args: { search: string; userId: string }, api) => {
    const request = api.dispatch(
      aiCourseApi.endpoints.getCourseRecommendations.initiate(args, {
        forceRefetch: true,
      }),
    );
    try {
      return await request.unwrap();
    } finally {
      request.unsubscribe();
    }
  },
);
export const expandAICourse = createAsyncThunk(
  'aiCourse/expand',
  async (
    args: { id: number; userId: string; generation: string | undefined },
    api,
  ) => {
    const request = api.dispatch(
      aiCourseApi.endpoints.getNextCourseCards.initiate({
        id: args.id,
        userId: args.userId,
      }),
    );
    try {
      return await request.unwrap();
    } finally {
      request.unsubscribe();
    }
  },
  {
    condition: (args, api) => {
      const state = (api.getState() as { aiCourse: CourseState }).aiCourse;
      return (
        state.searchRequest === args.generation &&
        state.nodes.some(n => n.id === String(args.id)) &&
        !state.branches[args.id] &&
        !state.expanded[args.id]
      );
    },
  },
);
const slice = createSlice({
  name: 'aiCourse',
  initialState,
  reducers: {
    searchChanged(state, action: PayloadAction<string>) {
      state.searchString = action.payload;
    },
    selected(state, action: PayloadAction<number>) {
      state.selectedCardId = action.payload;
    },
    rootSelected(state, action: PayloadAction<number>) {
      if (state.selectedDefaultCardID !== null) return;
      const node = state.nodes.find(n => n.id === String(action.payload));
      if (!node) return;
      state.selectedDefaultCardID = action.payload;
      state.nodes = [{ ...node, position: { x: 0, y: 0 } }];
      state.edges = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchAICourse.pending, (state, action) => {
        Object.assign(state, {
          ...initialState,
          searchString: state.searchString,
          isSearchButtonClicked: true,
          searchRequest: action.meta.requestId,
        });
      })
      .addCase(searchAICourse.fulfilled, (state, action) => {
        if (state.searchRequest !== action.meta.requestId) return;
        state.defaultCardIDs = action.payload;
        state.nodes = generateInitialNodes(action.payload);
        state.isDefaultCardsLoaded = true;
      })
      .addCase(searchAICourse.rejected, (state, action) => {
        if (state.searchRequest !== action.meta.requestId) return;
        state.isDefaultCardsLoaded = true;
        state.error = true;
      })
      .addCase(expandAICourse.pending, (state, action) => {
        state.branches[action.meta.arg.id] = action.meta.requestId;
      })
      .addCase(expandAICourse.fulfilled, (state, action) => {
        const { id, generation } = action.meta.arg;
        if (
          state.searchRequest !== generation ||
          state.branches[id] !== action.meta.requestId
        )
          return;
        delete state.branches[id];
        const root = state.nodes.find(n => n.id === String(id));
        if (!root) return;
        const ids = [...new Set(action.payload)].filter(
          next => !state.nodes.some(n => n.id === String(next)),
        );
        const nodes = [
          ...state.nodes,
          ...generateNextNodes(root.position, ids),
        ];
        const edges = [...state.edges, ...generateEdgesForNextNodes(id, ids)];
        const layout = getLayoutedElements(nodes, edges, { direction: 'LR' });
        state.nodes = layout.nodes;
        state.edges = layout.edges;
        state.expanded[id] = true;
      })
      .addCase(expandAICourse.rejected, (state, action) => {
        if (state.branches[action.meta.arg.id] === action.meta.requestId) {
          delete state.branches[action.meta.arg.id];
          state.error = true;
        }
      });
  },
});
export const aiCourseActions = slice.actions;
export default slice.reducer;
export function useAICourse() {
  const state = useAppSelector(s => s.aiCourse);
  const dispatch = useAppDispatch();
  const session = useUserSession();
  const userId = String(session.recommendationUserId || '-1');
  return {
    ...state,
    setSearchString: (text: string) =>
      dispatch(slice.actions.searchChanged(text)),
    onSearch: () =>
      dispatch(searchAICourse({ search: state.searchString, userId })),
    setSelectedCardID: (id: number) => dispatch(slice.actions.selected(id)),
    setDefaultCardID: (id: number) => dispatch(slice.actions.rootSelected(id)),
    loadNextCards: (id: number) =>
      dispatch(expandAICourse({ id, userId, generation: state.searchRequest })),
  };
}
