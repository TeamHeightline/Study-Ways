import {Box, Button} from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../../../../ReduxStore/RootStore";
import CreateExcelFile from "../utils/create-excel-file";
import DownloadIcon from '@mui/icons-material/Download';

export default function UiExcelExport() {
    const exam_id = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_id)
    const examResults = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results) || []

    const examResultsOrderBySum = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_results_order_by_sum)

    const question_statuses = examResults[0]?.question_statuses || []

    const questions_array = question_statuses
        ?.map((question_status) => question_status.question_id)
        ?.map((question_id) => "Вопрос №" + question_id)


    const columns = [
        'email пользователя',
        'Группа',
        'Фамилия',
        "Имя",
        'Сумма',
        ...questions_array
    ]
    const data = examResultsOrderBySum.map((exam_result) => ([
        exam_result?.users_customuser?.username,
        exam_result?.users_customuser?.users_userprofile?.group,
        exam_result?.users_customuser?.users_userprofile?.lastname,
        exam_result?.users_customuser?.users_userprofile?.firstname,
        exam_result?.sumOfAllPasses,
        ...exam_result?.question_statuses.map((question_status) => ([question_status?.percent]))
    ]))

    const fileName = "Результаты экзамена № " + exam_id + " актуальные на " + new Date(Date.now()).toLocaleString()

    function onClick() {
        CreateExcelFile({columns, data, fileName})
    }

    return (
        <Box>
            <Button color={"primary"} variant={"contained"} onClick={onClick} endIcon={<DownloadIcon/>}>
                Экспорт в Excel
            </Button>
        </Box>
    )
}
