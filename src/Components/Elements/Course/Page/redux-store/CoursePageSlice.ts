import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ICourseData} from "./types";
import {loadCourseDataThunk} from "./AsyncFunctions";


const initialState = {
    courses_data: [] as ICourseData[],
    is_loading_course_data: false,
    is_loading_error_course_data: false,
}

const coursePageSlice = createSlice({
    name: 'coursePage',
    initialState,
    reducers: {},
    extraReducers: {
        [loadCourseDataThunk.pending.type]: (state) => {
            state.is_loading_course_data = true
            state.is_loading_error_course_data = false
        },
        [loadCourseDataThunk.fulfilled.type]: (state, action: PayloadAction<ICourseData[]>) => {
            state.courses_data = action.payload
            state.is_loading_course_data = false
            state.is_loading_error_course_data = false
        },
        [loadCourseDataThunk.rejected.type]: (state, action) => {
            state.is_loading_course_data = false
            state.is_loading_error_course_data = true
        }
    }

})


export default coursePageSlice.reducer
