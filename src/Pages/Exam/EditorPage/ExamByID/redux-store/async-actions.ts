import {getQSByID} from "../../../../../Shared/ServerLayer/QueryLayer/question-sequence.query";
import {loadExamByID, updateExam} from "../../../../../Shared/ServerLayer/QueryLayer/exam.query";
import {createAsyncThunk} from "@reduxjs/toolkit";


export const loadQSDataThunk = createAsyncThunk(
    'examEditor/loadQSData',
    async (qsID: string) => {
        return getQSByID(qsID)
    }
)

export const loadExamDataThunk = createAsyncThunk(
    'examEditor/loadExamData',
    async (examID: string) => {
        return loadExamByID(examID)
    }
)

export const updateExamThunk = createAsyncThunk(
    'examEditor/updateExam',
    async (examData: any) => {
        const {id, ...examDataWithoutID} = examData;
        return updateExam(id, examDataWithoutID)
    }
)
