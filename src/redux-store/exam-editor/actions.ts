import {
    CHANGE_ACCESS_TYPE,
    CHANGE_EXAM_ID,
    CHANGE_SELECTED_QS_ID,
    LOAD_EXAM_DATA_SUCCESS,
    LOAD_QS_ERROR,
    LOAD_QS_SUCCESS,
    START_LOADING_EXAM_DATA,
    START_LOADING_QS
} from "./action-types";


export function changeExamEditorSelectedQsId(qs_id) {
    return {
        type: CHANGE_SELECTED_QS_ID,
        qs_id
    }
}

export function startLoadingExamEditorSelectedQsData() {
    return {
        type: START_LOADING_QS,
    }
}

export function loadExamEditorSelectedQsDataSuccess(qs_data) {
    return {
        type: LOAD_QS_SUCCESS,
        qs_data,
    }
}

export function loadExamEditorSelectedQsDataError(error) {
    return {
        type: LOAD_QS_ERROR,
        error
    }
}

export function changeAccessType(access_type: "manual" | "timeInterval") {
    return {
        type: CHANGE_ACCESS_TYPE,
        access_type
    }
}

export function successLoadExamData(exam_data) {
    return {
        type: LOAD_EXAM_DATA_SUCCESS,
        exam_data
    }
}

export function startLoadingExamData() {
    return {
        type: START_LOADING_EXAM_DATA,
    }
}

export function changeExamID(exam_id) {
    return {
        type: CHANGE_EXAM_ID,
        exam_id
    }
}
