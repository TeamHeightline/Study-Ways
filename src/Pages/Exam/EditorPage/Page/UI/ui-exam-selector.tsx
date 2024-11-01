import {CircularProgress, Paper, Stack, Table, TableBody, TableContainer} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {loadMyExamsAsync} from "../redux-store/async-actions";
import {useDispatch, useSelector} from "react-redux";
import UIExamSelectorTableHead from "./ui-exam-selector-table-head";
import UIExamSelectorRow from "./ui-exam-selector-row";
import UICreateExam from "./ui-create-exam";
import {RootState} from "../../../../../App/ReduxStore/RootStore";

interface IUIExamSelectorProps extends PaperProps {

}

export default function UIExamSelector({...props}: IUIExamSelectorProps) {
    const dispatch: any = useDispatch();
    const myExams = useSelector((state: RootState) => state?.examEditorPageReducer?.exams)
    const loading_exams = useSelector((state: RootState) => state?.examEditorPageReducer?.loading_exams)
    useEffect(() => {
        dispatch(loadMyExamsAsync())
    }, [])
    if (loading_exams) {
        return (
            <Stack alignItems={"center"}>
                <CircularProgress/>
            </Stack>
        )
    }
    return (
        <Paper elevation={0} {...props}>
            <UICreateExam/>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <UIExamSelectorTableHead/>
                    <TableBody>
                        {myExams?.map((exam) => {
                            return (<UIExamSelectorRow exam={exam} key={exam.id}/>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )
}
