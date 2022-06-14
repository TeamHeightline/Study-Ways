import {Paper} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import UIExamSelector from "./ui-exam-selector";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ExamEditorByURL from "../../ExamByURL/ExamByURL";

interface IExamEditorPageProps extends PaperProps {

}

export default function ExamEditorPage({...props}: IExamEditorPageProps) {
    const {path} = useRouteMatch();

    return (
        <Paper elevation={0} {...props}>
            <Switch>
                <Route path={path + "/select/:examID"} component={ExamEditorByURL}/>
                <Route path={path} component={UIExamSelector}/>
            </Switch>
        </Paper>
    )
}
