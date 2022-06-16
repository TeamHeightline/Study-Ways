import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";

interface IExamResultsByIDProps extends PaperProps {
    exam_id: number;
}

export default function ExamResultsByID({exam_id, ...props}: IExamResultsByIDProps) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch
    }, [exam_id]);
    return (
        <Paper elevation={0} {...props}>

        </Paper>
    )
}
