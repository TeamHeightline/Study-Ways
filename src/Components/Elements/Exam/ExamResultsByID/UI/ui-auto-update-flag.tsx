import {FormControlLabel, Paper, Stack, Switch} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useState} from "react";
import {useInterval} from "./use-interval";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../../root-redux-store/RootReducer";
import {loadExamResultsAsync} from "../redux-store/async-actions";

interface IUIAutoUpdateFlagProps extends PaperProps {

}

export default function UIAutoUpdateFlag({...props}: IUIAutoUpdateFlagProps) {
    const examID = useSelector((state: RootState) => state?.examResultsByIDReducer?.exam_id)
    const dispatch: any = useDispatch();

    const [isAutoUpdate, setIsAutoUpdate] = useState(false);

    function update() {
        if (examID) {
            dispatch(loadExamResultsAsync(examID));
        }
    }

    useInterval(update, isAutoUpdate ? 5000 : null);

    return (
        <Paper elevation={0} {...props}>
            <Stack alignItems={"end"}>
                <FormControlLabel control={
                    <Switch
                        checked={isAutoUpdate}
                        onChange={() => setIsAutoUpdate(!isAutoUpdate)}/>
                } label="Автоматическое обновление"/>
            </Stack>
        </Paper>
    )
}
