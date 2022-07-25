import {Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {Typography} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIExamUrlsProps extends PaperProps {

}

export default function UIExamUrls({...props}: IUIExamUrlsProps) {
    const selectedQSID = useSelector((state: RootState) => state?.examEditor?.exam_data?.question_sequence_id)
    const examUid = useSelector((state: RootState) => state?.examEditor?.exam_data?.uid)
    return (
        <Paper elevation={0} {...props}>
            <Stack direction={"column"} spacing={2}>
                <Typography>
                    Ссылка на экзамен: <br/> https://www.sw-university.com/exam/{examUid}
                </Typography>
                {selectedQSID &&
                    <Typography>
                        Тренировочный вариант серии вопросов: <br/> https://www.sw-university.com/qs/{selectedQSID}
                    </Typography>}
            </Stack>
        </Paper>
    )
}
