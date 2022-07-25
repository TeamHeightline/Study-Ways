import {Paper, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {PaperProps} from "@mui/material/Paper/Paper";
import {useDispatch, useSelector} from "react-redux";
import {changeAccessMode} from "../redux-store/examEditorSlice";
import {RootState} from "../../../../../../root-redux-store/RootStore";

interface IUIAccessTypeTogleProps extends PaperProps {

}

export default function UIAccessTypeToggle({...props}: IUIAccessTypeTogleProps) {
    const dispath = useDispatch()
    const accessMode = useSelector((state: RootState) => state?.examEditor?.exam_data?.access_mode)

    function changeAccessTypeHandle(e, newAccessType) {
        dispath(changeAccessMode(newAccessType))
    }

    return (
        <Paper elevation={0} {...props}>
            {/*Toggle component with variants: 1)manual 2) in time*/}
            <ToggleButtonGroup
                color="primary"
                exclusive
                value={accessMode}
                // onChange={changeAccessTypeHandle}
                // size={"small"}
            >
                <ToggleButton value="manual">Вручную</ToggleButton>
                <ToggleButton value="timeInterval" disabled>Промежуток времени</ToggleButton>
            </ToggleButtonGroup>
        </Paper>
    )
}
