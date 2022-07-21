import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosClient from "../../../../../ServerLayer/QueryLayer/config";
import {ICourseData} from "./types";

export const loadCourseDataThunk = createAsyncThunk(
    'coursePage/loadCourseData',
    async () => {
        return axiosClient.get<ICourseData[]>('/page/course')
            .then((res) => res.data)
    }
)
