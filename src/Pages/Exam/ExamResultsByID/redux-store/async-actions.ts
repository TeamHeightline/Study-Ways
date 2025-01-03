import {getExamResults} from "../../../../Shared/ServerLayer/QueryLayer/exam.query";
import {createAsyncThunk} from "@reduxjs/toolkit";


export const loadExamResultsAsync = createAsyncThunk(
    'examResults/load',
    async (exam_id: number, {dispatch}) => {
        return getExamResults(exam_id);
    }
);