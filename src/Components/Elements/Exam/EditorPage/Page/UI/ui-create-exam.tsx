import {Button, Paper, Stack} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import AddIcon from '@mui/icons-material/Add';
import {useDispatch} from "react-redux";
import {changeIsOpenCreateExamDialog} from "../redux-store/actions";
import UICreateExamDialog from "./ui-create-exam-dialog";

interface IUICreateExamProps extends PaperProps {

}

export default function UICreateExam({...props}: IUICreateExamProps) {
    const dispatch = useDispatch();

    function openCreateExamDialog() {
        dispatch(changeIsOpenCreateExamDialog(true))
    }


    return (
        <Paper elevation={0} {...props}>
            <UICreateExamDialog/>
            <Stack alignItems={"end"}>
                <Button
                    onClick={openCreateExamDialog}
                    sx={{mt: 2, mb: 2, ml: 2}}
                    startIcon={<AddIcon/>}
                    variant="outlined">
                    Создать экзамен
                </Button>
            </Stack>
        </Paper>
    )
}
