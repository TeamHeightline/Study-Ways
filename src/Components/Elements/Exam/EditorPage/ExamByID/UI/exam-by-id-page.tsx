import {observer} from "mobx-react";
import React from 'react';
import {PaperProps} from "@mui/material/Paper/Paper";
import {Divider, Paper, Stack} from "@mui/material";
import GoBackButton from "./go-back";
import ExamName from "./exam-name";
import UIPageTitle from "./ui-page-title";
import UIDuration from "./ui-duration";
import UIQuestionSequenceSelector from "./ui-question-sequence-selector";
import SelectedQSByData from "./ui-seleced-qs-by-data";
import UIAccessTypeToggle from "./ui-access-type-togle";
import UIAccessTypeVariants from "./ui-access-type-variants";
import UIStudentsAccessType from "./ui-students-access-type";
import {Typography} from "antd";


interface IExamByIDProps extends PaperProps {

}

const ExamByID = observer(({...props}: IExamByIDProps) => {
    return (
        <Paper elevation={0} {...props} sx={{pt: 2}}>
            <UIPageTitle/>
            <GoBackButton/>
            <Stack direction={"row"} spacing={1} sx={{pb: 2}}>
                <Stack direction={"column"} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Настройки</Divider>
                    </div>
                    <ExamName sx={{pt: 1}}/>
                    <UIDuration/>
                    <UIQuestionSequenceSelector/>
                    <SelectedQSByData/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={"column"} spacing={1} width={400}>
                    <div>
                        <Divider>Проводится в </Divider>
                    </div>
                    <UIAccessTypeToggle/>
                    <UIAccessTypeVariants/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Допуск к экзамену</Divider>
                    </div>
                    <UIStudentsAccessType/>
                </Stack>

                <div>
                    <Divider orientation={"vertical"}/>
                </div>

                <Stack direction={'column'} spacing={1} maxWidth={400}>
                    <div>
                        <Divider>Ссылки</Divider>
                    </div>
                    <Typography>
                        Ссылка для студентов: https://www.sw-university.com/exam/meemiljxl123
                    </Typography>
                    <Typography>
                        Ссылка для проверки: https://www.sw-university.com/exam/meemiljxl123/check
                    </Typography>
                    <Typography>
                        Тренировочный вариант серии вопросов: https://www.sw-university.com/qs/40
                    </Typography>
                </Stack>

            </Stack>
            <Divider>Статистика</Divider>
        </Paper>
    )
})

export default ExamByID
