import {Paper, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../root-redux-store/RootReducer";

interface IUIExamNameProps extends PaperProps {

}

export default function UIExamName({...props}: IUIExamNameProps) {
    const examName = useSelector((state: RootState) => state?.ExamByUIDReducer?.exam_name)

    return (
        <Paper elevation={0} {...props}>
            <Stack alignItems={"center"}>
                <Typography variant={"h2"}>
                    {examName}
                </Typography>
            </Stack>
        </Paper>
    )
}
