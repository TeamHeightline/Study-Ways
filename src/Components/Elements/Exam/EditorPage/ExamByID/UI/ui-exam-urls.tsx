import {Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {Typography} from "antd";
import React from "react";
import {RootState} from "../../../../../../redux-store/RootReducer";
import {useSelector} from "react-redux";

interface IUIExamUrlsProps extends PaperProps {

}

export default function UIExamUrls({...props}: IUIExamUrlsProps) {
    const selectedQSID = useSelector((state: RootState) => state?.examEditorReducer?.exam_data?.question_sequence_id)
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"column"} spacing={2}>
                <Typography>
                    Ссылка для студентов: <br/> https://www.sw-university.com/exam/meemiljxl123
                </Typography>
                <Typography>
                    Ссылка для проверки: <br/> https://www.sw-university.com/exam/meemiljxl123/check
                </Typography>
                {selectedQSID &&
                    <Typography>
                        Тренировочный вариант серии вопросов: <br/> https://www.sw-university.com/qs/{selectedQSID}
                    </Typography>}
            </Stack>
        </Paper>
    )
}
