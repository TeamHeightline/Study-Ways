import {observer} from "mobx-react";
import {Button} from "@mui/material";
import React from "react";
import {useAppDispatch} from "../../../../../../root-redux-store/RootStore";
import {openCreateQuestionDialog} from "../redux-store/QuestionEditorPageSlice";
import AddIcon from '@mui/icons-material/Add';

export const UiCreateNewQuestion = observer(() => {
    const dispatch = useAppDispatch()
    return (
        <>
            <Button
                startIcon={<AddIcon/>}
                sx={{maxWidth: 400}}
                variant="contained"
                color="primary"
                fullWidth
                size="large" onClick={() => {
                dispatch(openCreateQuestionDialog())
            }}>
                Создать новый вопрос
            </Button>
        </>
    )
})