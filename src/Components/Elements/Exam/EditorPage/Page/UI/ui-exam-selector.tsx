import {Paper, Table, TableBody, TableContainer} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useEffect} from "react";
import {loadMyExamsAsync} from "../redux-store/async-actions";
import {useDispatch, useSelector} from "react-redux";
import UIExamSelectorTableHead from "./ui-exam-selector-table-head";
import {RootState} from "../../../../../../root-redux-store/RootReducer";
import UIExamSelectorRow from "./ui-exam-selector-row";

interface IUIExamSelectorProps extends PaperProps {

}

export default function UIExamSelector({...props}: IUIExamSelectorProps) {
    const dispatch: any = useDispatch();
    const myExams = useSelector((state: RootState) => state?.examEditorPageReducer?.exams)
    useEffect(() => {
        dispatch(loadMyExamsAsync())
    }, [])
    return (
        <Paper elevation={0} {...props}>
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
