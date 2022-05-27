import {
    EXAM_EDITOR_CHANGE_ACCESS_TYPE,
    EXAM_EDITOR_CHANGE_SELECTED_QS_ID,
    EXAM_EDITOR_LOAD_QS_ERROR,
    EXAM_EDITOR_LOAD_QS_SUCCESS,
    EXAM_EDITOR_START_LOADING_QS
} from "../ActionTypes";

export function changeExamEditorSelectedQsId(qs_id) {
    return {
        type: EXAM_EDITOR_CHANGE_SELECTED_QS_ID,
        qs_id
    }
}

export function startLoadingExamEditorSelectedQsData() {
    return {
        type: EXAM_EDITOR_START_LOADING_QS,
    }
}

export function loadExamEditorSelectedQsDataSuccess(qs_data) {
    return {
        type: EXAM_EDITOR_LOAD_QS_SUCCESS,
        qs_data,
    }
}

export function loadExamEditorSelectedQsDataError(error) {
    return {
        type: EXAM_EDITOR_LOAD_QS_ERROR,
        error
    }
}

export function changeAccessType(access_type: "manual" | "timeInterval") {
    return {
        type: EXAM_EDITOR_CHANGE_ACCESS_TYPE,
        access_type
    }
}
