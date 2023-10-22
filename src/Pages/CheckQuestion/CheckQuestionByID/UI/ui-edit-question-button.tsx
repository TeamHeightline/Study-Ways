import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Button, Paper} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {UserStorage} from "../../../../Store/UserStore/UserStore";
import {useNavigate} from "react-router-dom";

interface IUIEditQuestionButtonProps extends PaperProps {
    question_id?: string
}

const UIEditQuestionButton = observer(({question_id, ...props}: IUIEditQuestionButtonProps) => {
    const navigate = useNavigate()
    if (!question_id) {
        return <div/>
    }
    return (
        <Paper elevation={0} {...props}>
            {UserStorage.userAccessLevel == "ADMIN" &&
                <Button
                    onClick={() => navigate("/editor/question/selected/" + question_id)}
                    endIcon={<EditIcon/>}
                    variant={"contained"}>
                    Редактировать вопрос
                </Button>}
        </Paper>
    )
})

export default UIEditQuestionButton
