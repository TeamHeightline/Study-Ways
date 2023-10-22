import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import UIExamSelector from "./ui-exam-selector";
import {Route, Routes} from "react-router-dom";
import ExamEditorByURL from "../../ExamByURL/ExamByURL";


interface IExamEditorPageProps extends PaperProps {

}

export default function ExamEditorPage({...props}: IExamEditorPageProps) {

    return (
        <Paper elevation={0} {...props}>
            <Routes>
                <Route path={"/select/:examID"} element={<div><ExamEditorByURL/></div>}/>
                <Route path={"/*"} element={<div><UIExamSelector/></div>}/>
            </Routes>
        </Paper>
    )
}
