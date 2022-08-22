import {Paper, Stack, Typography} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../../../../root-redux-store/RootStore";
import {removeOneMinute} from "../redux-store/ExamPlayerSlice";
import useInterval from "./ui-use-interval";

interface IUIExamNameProps extends PaperProps {

}

export default function UIExamName({...props}: IUIExamNameProps) {
    const examName = useSelector((state: RootState) => state?.examPlayer?.exam_data?.name)
    const dispatch = useAppDispatch()
    
    useInterval(() => {
        dispatch(removeOneMinute())
    }, 60000)

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
